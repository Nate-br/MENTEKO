import { useState } from 'react';
import { useScenarios } from '@/hooks/useScenarios';
import { useSession } from '@/hooks/useSession';
import { ScenarioCard } from '@/components/scenario/ScenarioCard';
import { Sparkles } from 'lucide-react';

const FILTER_ITEMS = [
  { id: 'all', label: 'All Threats' },
  { id: 'interactive', label: 'Interactive Drills', icon: Sparkles },
  { id: 'phishing', label: 'Phishing' },
  { id: 'impersonation', label: 'Impersonation' },
  { id: 'payment-fraud', label: 'Payment Fraud' },
  { id: 'fake-evidence', label: 'Fake Evidence' },
  { id: 'baiting', label: 'Baiting (USB/QR)' },
  { id: 'scareware', label: 'Scareware' },
  { id: 'social-engineering', label: 'Social Engineering' },
];

export function Simulate() {
  const { scenarios, loading } = useScenarios();
  const { attempts } = useSession();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const completedIds = new Set(attempts.map((a) => a.scenario._id));

  const filteredScenarios = scenarios.filter((s) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'interactive') {
      return s._id.startsWith('sim-interactive') || s.content?.meta?.interactive === 'true';
    }
    return s.category === activeFilter;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-xs tracking-wide text-cyan">SIMULATION CENTER</p>
      <h1 className="mt-3 text-3xl font-semibold text-text sm:text-4xl">Choose a scenario</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Each simulation presents a realistic message, call, or request. Read it the way you would
        in real life, then decide how to respond. Experience realistic webmail, credential harvesters,
        and simulated attacks.
      </p>

      {/* Filter Tabs */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {FILTER_ITEMS.map((item) => {
          const isActive = activeFilter === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveFilter(item.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan text-bg shadow-sm font-semibold'
                  : 'bg-panel-2 border border-line text-muted hover:text-text hover:border-cyan/30'
              }`}
            >
              {Icon && <Icon size={12} className={isActive ? 'text-bg' : 'text-purple'} />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="mt-12 font-mono text-sm text-muted">loading scenarios…</p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredScenarios.map((scenario, i) => (
            <ScenarioCard
              key={scenario._id}
              scenario={scenario}
              index={i}
              completed={completedIds.has(scenario._id)}
            />
          ))}
        </div>
      )}

      {attempts.length > 0 && (
        <div className="mt-10 flex items-center gap-3 font-mono text-xs text-muted">
          <span className="text-green">{attempts.length}</span> of {scenarios.length} completed this
          session
        </div>
      )}
    </div>
  );
}
