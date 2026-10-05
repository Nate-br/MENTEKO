import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { ScoreRing } from '@/components/dashboard/ScoreRing';
import { CategoryBar } from '@/components/dashboard/CategoryBar';
import { CheckCircle2, AlertCircle, Mail, Send, X } from 'lucide-react';
import { api } from '@/lib/api';

function scoreLabel(score: number): string {
  if (score >= 90) return 'EXCELLENT INSTINCTS';
  if (score >= 70) return 'GOOD START';
  if (score >= 40) return 'BUILDING AWARENESS';
  return 'KEEP PRACTICING';
}

export function Result() {
  const { attempts, resilienceScore, categoryBreakdown, resetSession } = useSession();

  // Email report modal state
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [traineeName, setTraineeName] = useState('');
  const [traineeEmail, setTraineeEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);
  const [emailErrorMsg, setEmailErrorMsg] = useState<string | null>(null);

  if (attempts.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-muted">No training session found yet.</p>
        <Button as="link" to="/simulate" variant="primary" size="lg" className="mt-6">
          Start Training
        </Button>
      </div>
    );
  }

  const strengths = categoryBreakdown.filter((c) => c.correct === c.total && c.total > 0);
  const weaknesses = categoryBreakdown.filter((c) => c.correct < c.total);

  const categoryName: Record<string, string> = {
    phishing: 'phishing',
    impersonation: 'impersonation',
    'payment-fraud': 'payment requests',
    'fake-evidence': 'transaction verification',
    'social-engineering': 'social engineering',
    baiting: 'physical baiting',
    scareware: 'browser scareware',
  };

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!traineeEmail.trim()) return;

    setSendingEmail(true);
    setEmailErrorMsg(null);
    setEmailSuccessMsg(null);

    const breakdownMap: Record<string, any> = {};
    categoryBreakdown.forEach((c) => {
      breakdownMap[c.category] = {
        correct: c.correct,
        total: c.total,
        score: c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0,
      };
    });

    try {
      const res = await api.sendReportEmail({
        email: traineeEmail.trim(),
        name: traineeName.trim() || 'Cyber Defender',
        score: resilienceScore,
        correct: attempts.filter((a) => a.correct).length,
        total: attempts.length,
        categoryBreakdown: breakdownMap,
      });

      if (res.success) {
        setEmailSuccessMsg(res.message || 'Certificate sent to your inbox!');
        setTimeout(() => {
          setEmailModalOpen(false);
          setEmailSuccessMsg(null);
        }, 2500);
      } else {
        setEmailErrorMsg('Failed to send certificate.');
      }
    } catch (err: any) {
      setEmailErrorMsg(err?.message || 'Failed to send certificate.');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-wide text-cyan">TRAINING COMPLETE</p>
          <h1 className="mt-1 text-3xl font-semibold text-text sm:text-4xl">Your resilience score</h1>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setEmailModalOpen(true)}
          className="flex items-center gap-1.5 border border-cyan/40 text-cyan hover:bg-cyan/10"
        >
          <Mail size={14} />
          <span>Email Certificate</span>
        </Button>
      </div>

      <Panel padding="lg" className="mt-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
          <ScoreRing score={resilienceScore} />
          <div className="flex-1 space-y-6">
            <div>
              <p className="font-mono text-xs tracking-wide text-cyan">{scoreLabel(resilienceScore)}</p>
              <p className="mt-2 text-sm text-muted">
                You correctly handled {attempts.filter((a) => a.correct).length} of {attempts.length}{' '}
                simulated scenarios this session.
              </p>
            </div>

            {strengths.length > 0 && (
              <div>
                <p className="text-sm font-medium text-text">You recognized:</p>
                <ul className="mt-2 space-y-1.5">
                  {strengths.map((s) => (
                    <li key={s.category} className="flex items-center gap-2 text-sm text-green">
                      <CheckCircle2 size={14} /> {categoryName[s.category] || s.category}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {weaknesses.length > 0 && (
              <div>
                <p className="text-sm font-medium text-text">Improve:</p>
                <ul className="mt-2 space-y-1.5">
                  {weaknesses.map((w) => (
                    <li key={w.category} className="flex items-center gap-2 text-sm text-purple">
                      <AlertCircle size={14} /> {categoryName[w.category] || w.category}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Panel>

      <Panel padding="lg" className="mt-6">
        <p className="font-mono text-xs tracking-wide text-muted">CATEGORY BREAKDOWN</p>
        <div className="mt-5 space-y-5">
          {categoryBreakdown.map((c) => (
            <CategoryBar key={c.category} category={c.category} correct={c.correct} total={c.total} />
          ))}
        </div>
      </Panel>

      {weaknesses.length > 0 && (
        <Panel padding="lg" className="mt-6" glow="purple">
          <p className="font-mono text-xs tracking-wide text-purple">NEXT STEP</p>
          <p className="mt-2 text-sm text-text">
            Practice more scenarios focused on {categoryName[weaknesses[0].category] || weaknesses[0].category}.
          </p>
        </Panel>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Button as="link" to="/assessment" variant="primary" size="lg">
          Take Full Assessment
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => setEmailModalOpen(true)}
          className="flex items-center gap-2 text-cyan border-cyan/40"
        >
          <Mail size={16} />
          <span>Email My Certificate</span>
        </Button>
        <Link to="/simulate" onClick={resetSession}>
          <Button variant="ghost" size="lg">
            Train Again
          </Button>
        </Link>
      </div>

      {/* Email Certificate Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
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
                <h3 className="text-lg font-semibold text-text">Email Resilience Certificate</h3>
                <p className="text-xs text-muted">Receive your verified badge and category breakdown</p>
              </div>
            </div>

            <form onSubmit={handleSendReport} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 uppercase">
                  Your Full Name
                </label>
                <input
                  type="text"
                  placeholder="Natnael Sisay"
                  value={traineeName}
                  onChange={(e) => setTraineeName(e.target.value)}
                  className="w-full rounded-lg border border-line bg-panel-2 px-3.5 py-2.5 text-sm text-text outline-none focus:border-cyan focus:ring-1 focus:ring-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={traineeEmail}
                  onChange={(e) => setTraineeEmail(e.target.value)}
                  className="w-full rounded-lg border border-line bg-panel-2 px-3.5 py-2.5 text-sm text-text outline-none focus:border-cyan focus:ring-1 focus:ring-cyan"
                />
              </div>

              {emailSuccessMsg && (
                <div className="flex items-center gap-2 rounded-lg bg-green/10 border border-green/30 p-3 text-xs text-green">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{emailSuccessMsg}</span>
                </div>
              )}

              {emailErrorMsg && (
                <div className="flex items-center gap-2 rounded-lg bg-red/10 border border-red/30 p-3 text-xs text-red">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{emailErrorMsg}</span>
                </div>
              )}

              <p className="text-[11px] leading-relaxed text-muted">
                Sent from <span className="font-mono text-cyan">noreply@savethegeneration.com.et</span> via your server's secure Exim mail service.
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
                  disabled={sendingEmail}
                  className="flex items-center gap-1.5"
                >
                  {sendingEmail ? (
                    <span>Sending Certificate…</span>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Send Certificate</span>
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
