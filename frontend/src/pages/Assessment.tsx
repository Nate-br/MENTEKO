import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScenarios } from '@/hooks/useScenarios';
import type { Scenario, ScenarioCategory } from '@/types';
import { ScenarioContentView } from '@/components/scenario/ScenarioContentView';
import { DecisionPanel } from '@/components/scenario/DecisionPanel';
import { FeedbackPanel } from '@/components/scenario/FeedbackPanel';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { ScoreRing } from '@/components/dashboard/ScoreRing';
import { CategoryBar } from '@/components/dashboard/CategoryBar';

interface LocalAttempt {
  scenario: Scenario;
  optionId: string;
  correct: boolean;
}

const categoryName: Record<ScenarioCategory, string> = {
  phishing: 'phishing',
  impersonation: 'impersonation',
  'payment-fraud': 'payment requests',
  'fake-evidence': 'transaction verification',
  'social-engineering': 'social engineering',
  baiting: 'physical & QR baiting',
  scareware: 'scareware & fake alerts',
};

export function Assessment() {
  const { scenarios, loading } = useScenarios();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<LocalAttempt[]>([]);

  const current = scenarios[index];
  const finished = started && index >= scenarios.length;

  const score = useMemo(() => {
    if (attempts.length === 0) return 0;
    return Math.round((attempts.filter((a) => a.correct).length / attempts.length) * 100);
  }, [attempts]);

  const breakdown = useMemo(() => {
    const map = new Map<ScenarioCategory, { correct: number; total: number }>();
    for (const a of attempts) {
      const c = map.get(a.scenario.category) ?? { correct: 0, total: 0 };
      c.total += 1;
      if (a.correct) c.correct += 1;
      map.set(a.scenario.category, c);
    }
    return Array.from(map.entries()).map(([category, v]) => ({ category, ...v }));
  }, [attempts]);

  const handleSelect = (optionId: string) => {
    if (!current) return;
    const option = current.options.find((o) => o.id === optionId);
    setAttempts((prev) => [...prev, { scenario: current, optionId, correct: Boolean(option?.isCorrect) }]);
    setSelected(optionId);
  };

  const handleNext = () => {
    setSelected(null);
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setStarted(false);
    setIndex(0);
    setSelected(null);
    setAttempts([]);
  };

  if (loading) {
    return <p className="mx-auto max-w-3xl px-4 py-24 font-mono text-sm text-muted">loading…</p>;
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="font-mono text-xs tracking-wide text-cyan">FULL ASSESSMENT</p>
        <h1 className="mt-3 text-3xl font-semibold text-text sm:text-4xl">
          Test your resilience across every category
        </h1>
        <p className="mt-4 text-muted">
          You'll go through {scenarios.length} scenarios spanning phishing, impersonation, payment
          fraud, fake evidence, and social engineering. Answer honestly — as you would in real life.
        </p>
        <Button
          variant="primary"
          size="lg"
          className="mt-8"
          onClick={() => setStarted(true)}
        >
          Begin Assessment
        </Button>
      </div>
    );
  }

  if (finished) {
    const strengths = breakdown.filter((b) => b.correct === b.total);
    const weaknesses = breakdown.filter((b) => b.correct < b.total);

    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="font-mono text-xs tracking-wide text-cyan">ASSESSMENT COMPLETE</p>
        <h1 className="mt-3 text-3xl font-semibold text-text sm:text-4xl">Your results</h1>

        <Panel padding="lg" className="mt-10">
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
            <ScoreRing score={score} />
            <div className="flex-1 space-y-5">
              <p className="text-sm text-muted">
                {attempts.filter((a) => a.correct).length} of {attempts.length} scenarios handled safely.
              </p>
              {strengths.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-text">Strengths</p>
                  <p className="mt-1 text-sm text-green">
                    {strengths.map((s) => categoryName[s.category]).join(', ')}
                  </p>
                </div>
              )}
              {weaknesses.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-text">Weaknesses</p>
                  <p className="mt-1 text-sm text-purple">
                    {weaknesses.map((w) => categoryName[w.category]).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Panel>

        <Panel padding="lg" className="mt-6">
          <p className="font-mono text-xs tracking-wide text-muted">CATEGORY SCORES</p>
          <div className="mt-5 space-y-5">
            {breakdown.map((b) => (
              <CategoryBar key={b.category} category={b.category} correct={b.correct} total={b.total} />
            ))}
          </div>
        </Panel>

        {weaknesses.length > 0 && (
          <Panel padding="lg" className="mt-6" glow="purple">
            <p className="font-mono text-xs tracking-wide text-purple">RECOMMENDED NEXT TRAINING</p>
            <p className="mt-2 text-sm text-text">
              Focus your next session on {categoryName[weaknesses[0].category]} scenarios.
            </p>
          </Panel>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Button variant="primary" size="lg" onClick={restart}>
            Retake Assessment
          </Button>
          <Link to="/simulate">
            <Button variant="secondary" size="lg">
              Practice Scenarios
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const selectedOption = current.options.find((o) => o.id === selected);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="font-mono text-xs text-muted">
        QUESTION {String(index + 1).padStart(2, '0')} / {String(scenarios.length).padStart(2, '0')}
      </span>
      <h1 className="mt-4 text-2xl font-semibold text-text sm:text-3xl">{current.title}</h1>
      <p className="mt-2 text-sm text-muted">{current.context}</p>

      <div className="mt-8 space-y-6">
        <ScenarioContentView scenario={current} />

        {!selected && <DecisionPanel options={current.options} onSelect={handleSelect} />}

        {selected && selectedOption && (
          <FeedbackPanel
            scenario={current}
            selectedOption={selected}
            correct={selectedOption.isCorrect}
            isLast={index === scenarios.length - 1}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
}
