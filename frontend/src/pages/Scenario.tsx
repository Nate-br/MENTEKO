import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useScenarios } from '@/hooks/useScenarios';
import { useSession } from '@/hooks/useSession';
import { SimulationStage } from '@/components/simulation/SimulationStage';
import { DecisionPanel } from '@/components/scenario/DecisionPanel';
import { FeedbackPanel } from '@/components/scenario/FeedbackPanel';
import {
  MentekoPhishingSimulation,
  isMentekoPhishingScenario,
} from '@/components/simulation/menteko/MentekoPhishingSimulation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Mail, CheckCircle2, AlertCircle, X, Send } from 'lucide-react';
import { api } from '@/lib/api';

export function ScenarioPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { scenarios, loading } = useScenarios();
  const { recordAttempt, attempts } = useSession();

  const [selected, setSelected] = useState<string | null>(null);

  // Email drill modal state
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [drillEmail, setDrillEmail] = useState('');
  const [sendingDrill, setSendingDrill] = useState(false);
  const [drillSuccessMsg, setDrillSuccessMsg] = useState<string | null>(null);
  const [drillErrorMsg, setDrillErrorMsg] = useState<string | null>(null);

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
    recordAttempt(scenario, optionId, Boolean(option?.isCorrect), {
      reported: optionId === 'opt-report',
      interactionOccurred: optionId === 'opt-click-link' || optionId === 'opt-reply',
      trainingCompleted: true,
    });
    setSelected(optionId);
  };

  const handleMentekoComplete = (
    optionId: string,
    correct: boolean,
    metrics: { interactionOccurred?: boolean; reported?: boolean; trainingCompleted?: boolean },
  ) => {
    recordAttempt(scenario, optionId, correct, metrics);
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

  const handleSendDrill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drillEmail.trim()) return;

    setSendingDrill(true);
    setDrillErrorMsg(null);
    setDrillSuccessMsg(null);

    try {
      const res = await api.sendDrillEmail({
        email: drillEmail.trim(),
        scenarioId: scenario._id,
      });
      if (res.success) {
        setDrillSuccessMsg(res.message || 'Drill email sent to your inbox!');
        setTimeout(() => {
          setEmailModalOpen(false);
          setDrillSuccessMsg(null);
        }, 2500);
      } else {
        setDrillErrorMsg('Failed to send drill email.');
      }
    } catch (err: any) {
      setDrillErrorMsg(err?.message || 'Failed to dispatch email drill.');
    } finally {
      setSendingDrill(false);
    }
  };

  const selectedOption = scenario.options.find((o) => o.id === selected);

  // If this is an interactive bank/phishing credential drill, launch full 3-phase interactive stage
  if (isMentekoPhishingScenario(scenario)) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <MentekoPhishingSimulation
          scenario={scenario}
          index={index}
          total={scenarios.length}
          completedCount={alreadyCompletedCount}
          isLast={isLast}
          onComplete={handleMentekoComplete}
          onNext={handleNext}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-xs text-muted">
          SIMULATION {String(index + 1).padStart(2, '0')} / {String(scenarios.length).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEmailModalOpen(true)}
            className="flex items-center gap-1.5 text-xs text-cyan border border-cyan/30 hover:bg-cyan/10"
          >
            <Mail size={13} />
            <span>Send Drill to Inbox</span>
          </Button>
          <Badge tone="muted">{alreadyCompletedCount} completed</Badge>
        </div>
      </div>

      <h1 className="mt-4 text-2xl font-semibold text-text sm:text-3xl">{scenario.title}</h1>
      <p className="mt-2 text-sm text-muted">{scenario.context}</p>

      <div className="mt-8 space-y-6">
        <SimulationStage scenario={scenario} />

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

      {/* Email Drill Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-cyan/30 bg-[#08121a] p-6 shadow-2xl">
            <button
              onClick={() => setEmailModalOpen(false)}
              className="absolute right-4 top-4 text-muted hover:text-text"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text">Send Phishing Drill to Inbox</h3>
                <p className="text-xs text-muted">Experience this scenario in your actual email client</p>
              </div>
            </div>

            <form onSubmit={handleSendDrill} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 uppercase">
                  Your Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={drillEmail}
                  onChange={(e) => setDrillEmail(e.target.value)}
                  className="w-full rounded-lg border border-line bg-panel-2 px-3.5 py-2.5 text-sm text-text outline-none focus:border-cyan focus:ring-1 focus:ring-cyan"
                />
              </div>

              {drillSuccessMsg && (
                <div className="flex items-center gap-2 rounded-lg bg-green/10 border border-green/30 p-3 text-xs text-green">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{drillSuccessMsg}</span>
                </div>
              )}

              {drillErrorMsg && (
                <div className="flex items-center gap-2 rounded-lg bg-red/10 border border-red/30 p-3 text-xs text-red">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{drillErrorMsg}</span>
                </div>
              )}

              <p className="text-[11px] leading-relaxed text-muted">
                Sent from <span className="font-mono text-cyan">noreply@savethegeneration.com.et</span>. This email contains an authorized educational drill link that tests if you recognize the indicators.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEmailModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={sendingDrill}
                  className="flex items-center gap-1.5"
                >
                  {sendingDrill ? (
                    <span>Sending…</span>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Send Drill</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
