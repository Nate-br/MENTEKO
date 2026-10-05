import { useState } from 'react';
import type { Scenario } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { DecisionPanel } from '@/components/scenario/DecisionPanel';
import { WebmailSimulation } from '@/components/simulation/webmail/WebmailSimulation';
import { MentekoTrainingLogin } from '@/components/simulation/menteko/MentekoTrainingLogin';
import { MentekoPhishingReveal } from '@/components/simulation/menteko/MentekoPhishingReveal';

type Phase = 'email' | 'login' | 'reveal';

interface MentekoPhishingSimulationProps {
  scenario: Scenario;
  index: number;
  total: number;
  completedCount: number;
  isLast: boolean;
  onComplete: (
    optionId: string,
    correct: boolean,
    metrics: { interactionOccurred?: boolean; reported?: boolean; trainingCompleted?: boolean },
  ) => void;
  onNext: () => void;
}

export function MentekoPhishingSimulation({
  scenario,
  index,
  total,
  completedCount,
  isLast,
  onComplete,
  onNext,
}: MentekoPhishingSimulationProps) {
  const [phase, setPhase] = useState<Phase>('email');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [credentialInteraction, setCredentialInteraction] = useState(false);

  const finishWithOption = (
    optionId: string,
    interactionOccurred: boolean,
    enteredCredentials: boolean,
  ) => {
    const option = scenario.options.find((o) => o.id === optionId);
    onComplete(optionId, Boolean(option?.isCorrect), {
      reported: optionId === 'opt-report',
      interactionOccurred: interactionOccurred || optionId === 'opt-reply',
      trainingCompleted: true,
    });
    setSelectedOptionId(optionId);
    setCredentialInteraction(enteredCredentials);
    setPhase('reveal');
  };

  const handleDecision = (optionId: string) => {
    if (optionId === 'opt-click-link') {
      setSelectedOptionId(optionId);
      setPhase('login');
      return;
    }
    finishWithOption(optionId, false, false);
  };

  const handleLoginContinue = (enteredCredentials: boolean) => {
    if (selectedOptionId === 'opt-click-link') {
      finishWithOption('opt-click-link', true, enteredCredentials);
    }
  };

  const revealOption = selectedOptionId
    ? scenario.options.find((o) => o.id === selectedOptionId)
    : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted">
          SIMULATION {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <Badge tone="muted">{completedCount} completed</Badge>
      </div>

      <p className="mt-2 font-mono text-[11px] tracking-wide text-cyan">SOCIAL ENGINEERING / PHISHING</p>
      <h1 className="mt-2 text-2xl font-semibold text-text sm:text-3xl">{scenario.title}</h1>
      <p className="mt-2 text-sm text-muted">{scenario.context}</p>

      <div className="mt-8 space-y-6">
        {phase === 'email' && (
          <>
            <WebmailSimulation scenario={scenario} />
            <DecisionPanel options={scenario.options} onSelect={handleDecision} />
          </>
        )}

        {phase === 'login' && (
          <MentekoTrainingLogin
            onContinue={handleLoginContinue}
            onBack={() => setPhase('email')}
          />
        )}

        {phase === 'reveal' && revealOption && selectedOptionId && (
          <MentekoPhishingReveal
            scenario={scenario}
            selectedOptionId={selectedOptionId}
            correct={revealOption.isCorrect}
            credentialInteraction={credentialInteraction}
            isLast={isLast}
            onNext={onNext}
          />
        )}
      </div>
    </div>
  );
}

export function isMentekoPhishingScenario(scenario: Scenario): boolean {
  return scenario.content.meta?.simulationModule === 'menteko-bank-phishing';
}
