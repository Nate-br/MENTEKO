import type { Scenario } from '@/types';
import { Panel } from '@/components/ui/Panel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface FeedbackPanelProps {
  scenario: Scenario;
  selectedOption: string;
  correct: boolean;
  isLast: boolean;
  onNext: () => void;
}

export function FeedbackPanel({ scenario, selectedOption, correct, isLast, onNext }: FeedbackPanelProps) {
  const selectedLabel = scenario.options.find((o) => o.id === selectedOption)?.label ?? selectedOption;

  return (
    <div className="space-y-6">
      <Panel glow={correct ? 'green' : 'purple'} padding="lg">
        <div className="flex items-center gap-2 font-mono text-xs tracking-wide text-muted">
          {correct ? <CheckCircle2 size={14} className="text-green" /> : <AlertTriangle size={14} className="text-purple" />}
          ANALYSIS COMPLETE
        </div>

        <h3 className={`mt-3 text-2xl font-semibold ${correct ? 'text-green' : 'text-purple'}`}>
          {correct ? 'SAFE RESPONSE' : 'SUSPICIOUS'}
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] tracking-wide text-muted">YOUR DECISION</p>
            <p className="mt-1 text-sm text-text">{selectedLabel}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-wide text-muted">RISK LEVEL</p>
            <Badge tone={correct ? 'green' : 'danger'}>{correct ? 'LOW' : 'HIGH'}</Badge>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted">{scenario.explanation}</p>
      </Panel>

      <Panel padding="lg">
        <p className="font-mono text-xs tracking-wide text-muted">INDICATORS</p>
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

      <Panel padding="lg" glow="cyan">
        <p className="font-mono text-xs tracking-wide text-cyan">BETTER RESPONSE</p>
        <p className="mt-3 text-sm leading-relaxed text-text">{scenario.betterResponse}</p>
      </Panel>

      <div className="flex justify-end">
        <Button variant="primary" size="lg" onClick={onNext}>
          {isLast ? 'View Result' : 'Next Scenario'}
        </Button>
      </div>
    </div>
  );
}
