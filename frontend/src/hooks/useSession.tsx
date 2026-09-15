import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Scenario, ScenarioCategory } from '@/types';
import { api } from '@/lib/api';

export interface SessionAttempt {
  scenario: Scenario;
  selectedOptionId: string;
  correct: boolean;
}

interface SessionContextValue {
  attempts: SessionAttempt[];
  recordAttempt: (scenario: Scenario, selectedOptionId: string, correct: boolean) => void;
  resetSession: () => void;
  resilienceScore: number;
  categoryBreakdown: { category: ScenarioCategory; correct: number; total: number }[];
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [attempts, setAttempts] = useState<SessionAttempt[]>([]);

  const recordAttempt = (scenario: Scenario, selectedOptionId: string, correct: boolean) => {
    setAttempts((prev) => [...prev, { scenario, selectedOptionId, correct }]);

    // Best-effort sync to backend; safe to ignore failures during local/dev use.
    api
      .submitAttempt({ scenario: scenario._id, selectedOption: selectedOptionId })
      .catch(() => undefined);
  };

  const resetSession = () => setAttempts([]);

  const resilienceScore = useMemo(() => {
    if (attempts.length === 0) return 0;
    const correctCount = attempts.filter((a) => a.correct).length;
    return Math.round((correctCount / attempts.length) * 100);
  }, [attempts]);

  const categoryBreakdown = useMemo(() => {
    const map = new Map<ScenarioCategory, { correct: number; total: number }>();
    for (const attempt of attempts) {
      const key = attempt.scenario.category;
      const current = map.get(key) ?? { correct: 0, total: 0 };
      current.total += 1;
      if (attempt.correct) current.correct += 1;
      map.set(key, current);
    }
    return Array.from(map.entries()).map(([category, value]) => ({ category, ...value }));
  }, [attempts]);

  return (
    <SessionContext.Provider
      value={{ attempts, recordAttempt, resetSession, resilienceScore, categoryBreakdown }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within a SessionProvider');
  return ctx;
}
