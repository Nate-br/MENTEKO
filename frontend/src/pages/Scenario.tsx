import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useScenarios } from '@/hooks/useScenarios';
import { useSession } from '@/hooks/useSession';
import { ScenarioContentView } from '@/components/scenario/ScenarioContentView';
import { DecisionPanel } from '@/components/scenario/DecisionPanel';
import { FeedbackPanel } from '@/components/scenario/FeedbackPanel';
import { Badge } from '@/components/ui/Badge';

export function ScenarioPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { scenarios, loading } = useScenarios();
  const { recordAttempt, attempts } = useSession();

  const [selected, setSelected] = useState<string | null>(null);

  const scenario = scenarios.find((s) => s._id === id);
  const index = scenarios.findIndex((s) => s._id === id);
  const isLast = index === scenarios.length - 1;
  const alreadyCompletedCount = attempts.length;

  if (loading) {
    return <p className="mx-auto max-w-3xl px-4 py-24 font-mono text-sm text-muted">loading…</p>;
  }

  if (!scenario) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-muted">Scenario not found.</p>
        <Link to="/simulate" className="mt-4 inline-block text-cyan hover:underline">
          Back to Simulate
        </Link>
      </div>
    );
  }

  const handleSelect = (optionId: string) => {
    const option = scenario.options.find((o) => o.id === optionId);
    recordAttempt(scenario, optionId, Boolean(option?.isCorrect));
    setSelected(optionId);
  };

  const handleNext = () => {
    const nextScenario = scenarios[index + 1];
    if (nextScenario) {
      navigate(`/simulate/${nextScenario._id}`);
      setSelected(null);
    } else {
      navigate('/result');
    }
  };

  const selectedOption = scenario.options.find((o) => o.id === selected);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted">
          SIMULATION {String(index + 1).padStart(2, '0')} / {String(scenarios.length).padStart(2, '0')}
        </span>
        <Badge tone="muted">{alreadyCompletedCount} completed</Badge>
      </div>

      <h1 className="mt-4 text-2xl font-semibold text-text sm:text-3xl">{scenario.title}</h1>
      <p className="mt-2 text-sm text-muted">{scenario.context}</p>

      <div className="mt-8 space-y-6">
        <ScenarioContentView scenario={scenario} />

        {!selected && <DecisionPanel options={scenario.options} onSelect={handleSelect} />}

        {selected && selectedOption && (
          <FeedbackPanel
            scenario={scenario}
            selectedOption={selected}
            correct={selectedOption.isCorrect}
            isLast={isLast}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
}
