import { useState } from 'react';
import type { DynamicDrill } from '@/data/dynamicDrills';
import { WebmailSimulation } from '@/components/simulation/webmail/WebmailSimulation';
import { MentekoTrainingLogin } from '@/components/simulation/menteko/MentekoTrainingLogin';
import { MentekoPhishingReveal } from '@/components/simulation/menteko/MentekoPhishingReveal';
import { Button } from '@/components/ui/Button';
import { Mail, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';

interface BankWebmailDrillProps {
  drill: DynamicDrill;
  token?: string;
  onComplete?: (result: { status: string; reactionTime?: number }) => void;
}

export function BankWebmailDrill({ drill, token, onComplete }: BankWebmailDrillProps) {
  const [phase, setPhase] = useState<'email' | 'login' | 'reveal'>('email');
  const [credentialInteraction, setCredentialInteraction] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [drillEmail, setDrillEmail] = useState('');
  const [sendingDrill, setSendingDrill] = useState(false);
  const [drillSuccessMsg, setDrillSuccessMsg] = useState<string | null>(null);

  // Adapt drill to scenario shape for child components
  const scenarioAdaptor: any = {
    _id: drill.id,
    title: drill.title,
    content: {
      sender: drill.emailTemplate?.fromEmail || 'alerts@secure.menteko.local',
      fromName: drill.emailTemplate?.fromName || 'Menteko Bank Security Alerts',
      fromEmail: drill.emailTemplate?.fromEmail || 'alerts@secure.menteko.local',
      to: 'you@company.example',
      sentAt: 'Mon 8:42 AM',
      subject: drill.emailTemplate?.subject || 'Action required: verify your Menteko Bank account',
      body: drill.emailTemplate?.body || '',
      callToAction: drill.emailTemplate?.callToAction || 'Verify account now',
      linkDisplay: 'https://www.mentekobank.com/verify',
      linkActual: 'https://secure.menteko.local/account/verify?id=trn-8841',
      meta: {
        simulationModule: 'menteko-bank-phishing',
        interactive: 'true',
      },
    },
    indicators: drill.indicators,
    options: [
      { id: 'opt-report', label: 'Report to Security Team', isCorrect: true },
      { id: 'opt-click-link', label: 'Click Verify Link', isCorrect: false },
      { id: 'opt-ignore', label: 'Ignore Message', isCorrect: false },
    ],
    explanation:
      'This simulation highlights how lookalike URLs and urgency trick employees into entering credentials on external attacker sites.',
    betterResponse: 'Verify via official banking app or contact SOC immediately.',
  };

  const handleSendEmailDrill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drillEmail.trim()) return;

    setSendingDrill(true);
    setDrillSuccessMsg(null);

    try {
      const res = await api.post('/drills/launch', {
        drillId: drill.id,
        email: drillEmail.trim(),
        name: 'Trainee Defender',
      });
      if (res.success) {
        setDrillSuccessMsg(res.message || 'Simulation drill delivered to your inbox!');
        setTimeout(() => {
          setEmailModalOpen(false);
          setDrillSuccessMsg(null);
        }, 2500);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setSendingDrill(false);
    }
  };

  const handleAction = async (action: string, isCompromised: boolean) => {
    try {
      if (token) {
        await api.post('/drills/action', {
          token,
          action,
          details: { isCompromised },
        });
      }
    } catch (e) {
      console.warn('Action logged locally:', e);
    }
  };

  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-cyan">
            Interactive Webmail Drill · {drill.category}
          </span>
          <h2 className="text-2xl font-bold text-text">{drill.title}</h2>
          <p className="text-sm text-muted">{drill.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {drill.serverEmailSupport && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEmailModalOpen(true)}
              className="flex items-center gap-1.5 text-xs text-cyan border border-cyan/30 hover:bg-cyan/10"
            >
              <Mail size={13} />
              Send to My Real Email
            </Button>
          )}
        </div>
      </div>

      {phase === 'email' && (
        <div className="space-y-4">
          <WebmailSimulation
            scenario={scenarioAdaptor}
            onCtaClick={() => {
              handleAction('click_link', false);
              setPhase('login');
            }}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-panel-2 p-4">
            <div>
              <p className="text-sm font-semibold text-text">Choose Your Immediate Action:</p>
              <p className="text-xs text-muted">Hover to preview link target or report immediately.</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  handleAction('report_phishing', false);
                  setPhase('reveal');
                  onComplete?.({ status: 'reported' });
                }}
                className="text-xs"
              >
                <ShieldCheck size={14} className="mr-1.5" />
                Report Phishing to SOC
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleAction('click_link', false);
                  setPhase('login');
                }}
                className="text-xs bg-red-600 hover:bg-red-500"
              >
                Click Verification Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {phase === 'login' && (
        <MentekoTrainingLogin
          onBack={() => setPhase('email')}
          onContinue={(entered) => {
            setCredentialInteraction(entered);
            handleAction('submit_credentials', true);
            setPhase('reveal');
            onComplete?.({ status: 'compromised' });
          }}
        />
      )}

      {phase === 'reveal' && (
        <div className="space-y-4">
          <MentekoPhishingReveal
            scenario={scenarioAdaptor}
            selectedOptionId={credentialInteraction ? 'opt-click-link' : 'opt-report'}
            correct={!credentialInteraction}
            credentialInteraction={credentialInteraction}
            isLast={true}
            onNext={() => onComplete?.({ status: 'completed' })}
          />
          <div className="flex justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setPhase('email');
                setCredentialInteraction(false);
              }}
              className="text-xs"
            >
              Restart Simulation Drill
            </Button>
          </div>
        </div>
      )}

      {/* Send Drill to Inbox Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-cyan/40 bg-panel-1 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-text flex items-center gap-2">
              <Mail className="text-cyan" size={20} />
              Dispatch Live Drill to Inbox
            </h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Test your real-world instincts in your actual inbox (Gmail, Outlook, phone). The email contains an authorized
              tracked drill link that measures reaction time and teaches indicator identification.
            </p>

            <form onSubmit={handleSendEmailDrill} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">Your Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="trainee@example.com"
                  value={drillEmail}
                  onChange={(e) => setDrillEmail(e.target.value)}
                  className="w-full rounded-lg border border-line bg-panel-2 px-3 py-2 text-sm text-text placeholder-muted/60 focus:border-cyan focus:outline-none"
                />
              </div>

              {drillSuccessMsg && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-2.5 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{drillSuccessMsg}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setEmailModalOpen(false)}
                  disabled={sendingDrill}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={sendingDrill || !drillEmail.trim()}
                  className="flex items-center gap-1.5"
                >
                  {sendingDrill ? (
                    'Dispatching...'
                  ) : (
                    <>
                      <Send size={13} /> Send Live Drill
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
