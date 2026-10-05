import { Link } from 'react-router-dom';
import type { Scenario } from '@/types';
import { Panel } from '@/components/ui/Panel';
import { Badge } from '@/components/ui/Badge';

const categoryLabel: Record<Scenario['category'], string> = {
  phishing: 'Phishing',
  impersonation: 'Impersonation',
  'payment-fraud': 'Payment Fraud',
  'fake-evidence': 'Fake Evidence',
  'social-engineering': 'Social Engineering',
  baiting: 'Baiting',
  scareware: 'Scareware',
};

const difficultyTone: Record<Scenario['difficulty'], 'green' | 'blue' | 'purple'> = {
  beginner: 'green',
  intermediate: 'blue',
  advanced: 'purple',
};

interface ScenarioCardProps {
  scenario: Scenario;
  index: number;
  completed?: boolean;
}

export function ScenarioCard({ scenario, index, completed }: ScenarioCardProps) {
  return (
    <Link to={`/simulate/${scenario._id}`} className="group block">
      <Panel className="h-full transition-colors group-hover:border-cyan/50" padding="md">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted">
            SIM {String(index + 1).padStart(2, '0')}
          </span>
          {completed && <Badge tone="green">COMPLETED</Badge>}
        </div>

        <h3 className="mt-4 text-lg font-semibold text-text">{scenario.title}</h3>
        <p className="mt-2 text-sm text-muted">{scenario.format}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Badge tone="cyan">{categoryLabel[scenario.category]}</Badge>
          <Badge tone={difficultyTone[scenario.difficulty]}>{scenario.difficulty}</Badge>
          {(scenario._id.startsWith('sim-interactive') || scenario.content?.meta?.interactive) && (
            <Badge tone="purple" className="border-purple/40 bg-purple/10 text-purple">
              Interactive Drill
            </Badge>
          )}
        </div>
      </Panel>
    </Link>
  );
}
