import { Link } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { ScoreRing } from '@/components/dashboard/ScoreRing';
import { CategoryBar } from '@/components/dashboard/CategoryBar';
import { CheckCircle2, AlertCircle } from 'lucide-react';

function scoreLabel(score: number): string {
  if (score >= 90) return 'EXCELLENT INSTINCTS';
  if (score >= 70) return 'GOOD START';
  if (score >= 40) return 'BUILDING AWARENESS';
  return 'KEEP PRACTICING';
}

export function Result() {
  const { attempts, resilienceScore, categoryBreakdown, resetSession } = useSession();

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
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-xs tracking-wide text-cyan">TRAINING COMPLETE</p>
      <h1 className="mt-3 text-3xl font-semibold text-text sm:text-4xl">Your resilience score</h1>

      <Panel padding="lg" className="mt-10">
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
                      <CheckCircle2 size={14} /> {categoryName[s.category]}
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
                      <AlertCircle size={14} /> {categoryName[w.category]}
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
            Practice more scenarios focused on {categoryName[weaknesses[0].category]}.
          </p>
        </Panel>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Button as="link" to="/assessment" variant="primary" size="lg">
          Take Full Assessment
        </Button>
        <Link to="/simulate" onClick={resetSession}>
          <Button variant="secondary" size="lg">
            Train Again
          </Button>
        </Link>
      </div>
    </div>
  );
}
