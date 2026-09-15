import type { ScenarioOption } from '@/types';
import { Panel } from '@/components/ui/Panel';

interface DecisionPanelProps {
  options: ScenarioOption[];
  onSelect: (optionId: string) => void;
}

export function DecisionPanel({ options, onSelect }: DecisionPanelProps) {
  return (
    <Panel padding="lg">
      <p className="font-mono text-xs tracking-wide text-muted">WHAT WOULD YOU DO?</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className="rounded-lg border border-line bg-panel-2 px-4 py-4 text-left text-sm font-medium text-text transition-colors hover:border-cyan hover:text-cyan focus-visible:border-cyan"
          >
            {option.label}
          </button>
        ))}
      </div>
    </Panel>
  );
}
