import type { ScenarioCategory } from '@/types';

const categoryLabel: Record<ScenarioCategory, string> = {
  phishing: 'Phishing',
  impersonation: 'Impersonation',
  'payment-fraud': 'Payment Fraud',
  'fake-evidence': 'Fake Evidence',
  'social-engineering': 'Social Engineering',
  baiting: 'Baiting',
  scareware: 'Scareware',
};

interface CategoryBarProps {
  category: ScenarioCategory;
  correct: number;
  total: number;
}

export function CategoryBar({ category, correct, total }: CategoryBarProps) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const color = pct >= 80 ? 'bg-green' : pct >= 50 ? 'bg-cyan' : 'bg-purple';

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-text">{categoryLabel[category]}</span>
        <span className="font-mono text-xs text-muted">
          {correct}/{total}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-panel-2">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
