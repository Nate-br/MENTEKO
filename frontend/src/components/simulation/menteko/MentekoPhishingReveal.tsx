import type { Scenario } from '@/types';
import { Panel } from '@/components/ui/Panel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Info } from 'lucide-react';

const habitSteps = [
  { step: 'STOP', detail: 'Do not act immediately.' },
  { step: 'CHECK', detail: 'Inspect the sender, request, URL, and context.' },
  { step: 'VERIFY', detail: 'Use an independent trusted channel.' },
  { step: "DON'T ACT", detail: 'Do not provide credentials or sensitive information.' },
  { step: 'REPORT', detail: "Use your organization's approved reporting process." },
];

interface MentekoPhishingRevealProps {
  scenario: Scenario;
  selectedOptionId: string;
  correct: boolean;
  credentialInteraction: boolean;
  isLast: boolean;
  onNext: () => void;
}

export function MentekoPhishingReveal({
  scenario,
  selectedOptionId,
  correct,
  credentialInteraction,
  isLast,
  onNext,
}: MentekoPhishingRevealProps) {
  const selected = scenario.options.find((o) => o.id === selectedOptionId);
  const isReport = selectedOptionId === 'opt-report';
  const isIgnore = selectedOptionId === 'opt-ignore';

  return (
    <div className="space-y-6">
      <Panel padding="lg" glow="cyan">
        <p className="font-mono text-xs tracking-wide text-cyan">PHISHING-AWARENESS SIMULATION</p>
        <h3 className="mt-3 text-xl font-semibold text-text">This was a controlled training exercise</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{scenario.explanation}</p>
        {selected?.outcomeNote && (
          <p className="mt-4 rounded-lg border border-line bg-panel-2 px-4 py-3 text-sm text-text">
            {selected.outcomeNote}
          </p>
        )}
        {(credentialInteraction || selectedOptionId === 'opt-click-link') && (
          <p className="mt-4 text-sm text-muted">
            {credentialInteraction
              ? 'You reached the training login page and entered details in the form. In a real attack, that could expose your credentials. Here, nothing you typed was saved or sent anywhere.'
              : 'You followed the link to the training login page. Even viewing a fake page can be risky in real life — attackers often log visits or trick you into downloading malware.'}
          </p>
        )}
      </Panel>

      <Panel padding="lg" glow={correct ? 'green' : 'none'}>
        <div className="flex items-center gap-2 font-mono text-xs tracking-wide text-muted">
          {correct ? (
            <CheckCircle2 size={14} className="text-green" />
          ) : (
            <Info size={14} className="text-purple" />
          )}
          YOUR DECISION
        </div>
        <p className="mt-2 text-lg font-medium text-text">{selected?.label}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone={isReport ? 'green' : isIgnore ? 'blue' : 'danger'}>
            {isReport ? 'STRONG HABIT' : isIgnore ? 'SAFE CHOICE' : 'HIGH RISK PATH'}
          </Badge>
          {!correct && (
            <Badge tone="muted">Learning moment — no penalty</Badge>
          )}
        </div>
      </Panel>

      <Panel padding="lg">
        <p className="font-mono text-xs tracking-wide text-muted">WHY WAS THIS SUSPICIOUS?</p>
        <div className="mt-4 space-y-4">
          {scenario.indicators.map((indicator, i) => (
            <div key={indicator.id} className="flex gap-4">
              <span className="font-mono text-xs text-cyan">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <p className="text-sm font-medium text-text">{indicator.title}</p>
                <p className="mt-1 text-sm text-muted">{indicator.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel padding="lg" glow="green">
        <p className="font-mono text-xs tracking-wide text-green">CORRECT EMPLOYEE RESPONSE</p>
        <p className="mt-3 text-sm leading-relaxed text-text">{scenario.betterResponse}</p>
        <ol className="mt-5 space-y-3">
          {habitSteps.map((item) => (
            <li key={item.step} className="flex gap-3 text-sm">
              <span className="font-mono text-xs font-semibold text-green">{item.step}</span>
              <span className="text-muted">{item.detail}</span>
            </li>
          ))}
        </ol>
      </Panel>

      <div className="flex justify-end">
        <Button variant="primary" size="lg" onClick={onNext}>
          {isLast ? 'View result' : 'Next scenario'}
        </Button>
      </div>
    </div>
  );
}
