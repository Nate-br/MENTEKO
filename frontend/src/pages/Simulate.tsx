import { useScenarios } from '@/hooks/useScenarios';
import { useSession } from '@/hooks/useSession';
import { ScenarioCard } from '@/components/scenario/ScenarioCard';

export function Simulate() {
  const { scenarios, loading } = useScenarios();
  const { attempts } = useSession();

  const completedIds = new Set(attempts.map((a) => a.scenario._id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-xs tracking-wide text-cyan">SIMULATION CENTER</p>
      <h1 className="mt-3 text-3xl font-semibold text-text sm:text-4xl">Choose a scenario</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Each simulation presents a realistic message, call, or request. Read it the way you would
        in real life, then decide how to respond. There's no trick — just the situation.
      </p>

      {loading ? (
        <p className="mt-12 font-mono text-sm text-muted">loading scenarios…</p>
      ) : (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario, i) => (
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
