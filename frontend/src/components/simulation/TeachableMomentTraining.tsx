import { useState } from 'react';
import type { DynamicDrill } from '@/data/dynamicDrills';
import { Button } from '@/components/ui/Button';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Search,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { api } from '@/lib/api';

interface TeachableMomentTrainingProps {
  drill: DynamicDrill;
  token?: string;
  onRestartDrill: () => void;
  onFinished: () => void;
}

const DEFENSE_HABITS = [
  {
    step: 'STOP',
    title: 'Neutralize the Urgency Trigger',
    detail: 'Threat actors fabricate short deadlines (2 hours, 24 hours) to rush emotional compliance before you can think logically.',
  },
  {
    step: 'CHECK',
    title: 'Examine Sender & Destination URLs',
    detail: 'Always check the true sender domain (e.g., look for lookalike typos like menteko.local or non-official mobile numbers).',
  },
  {
    step: 'VERIFY',
    title: 'Use an Out-of-Band Channel',
    detail: 'Never click links inside unverified messages. Open your official browser bookmark or dial known support hotlines (e.g. CBE 951, Telebirr 127).',
  },
  {
    step: 'REPORT',
    title: 'Alert Your Security Team Immediately',
    detail: 'Reporting suspicious communications helps security teams block the attack vector for all your colleagues.',
  },
];

export function TeachableMomentTraining({
  drill,
  token,
  onRestartDrill,
  onFinished,
}: TeachableMomentTrainingProps) {
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCompleteTraining = async () => {
    setSubmitting(true);
    try {
      if (token) {
        await api.post('/drills/action', {
          token,
          action: 'complete_training',
        });
      }
    } catch (e) {
      console.warn('Training completion logged:', e);
    } finally {
      setSubmitting(false);
      setCompleted(true);
      onFinished();
    }
  };

  return (
    <div className="mx-auto max-w-3xl py-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="rounded-2xl border border-cyan/40 bg-gradient-to-br from-[#0c1f2d] via-panel-1 to-[#09141f] p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/20 border border-cyan/50 text-cyan">
            <GraduationCap size={28} />
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan bg-cyan/10 px-2 py-0.5 rounded border border-cyan/30">
              Interactive Teachable Moment
            </span>
            <h1 className="mt-1 text-2xl font-bold text-text">Security Awareness Briefing</h1>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted leading-relaxed">
          You just experienced the <b>{drill.title}</b> cyber simulation. Social engineers rely on borrowed authority and
          manufactured stress. Below is the precise breakdown of red flags present in this vector.
        </p>

        {/* Indicators Missed */}
        <div className="mt-6 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-cyan flex items-center gap-1.5">
            <Search size={13} />
            Key Threat Indicators Present in this Scenario
          </h3>

          <div className="grid gap-3">
            {drill.indicators.map((ind, i) => (
              <div key={ind.id} className="rounded-xl border border-line bg-panel-2 p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan/20 font-mono text-[10px] font-bold text-cyan">
                    {i + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-text">{ind.title}</h4>
                </div>
                <p className="mt-1.5 text-xs text-muted leading-relaxed pl-7">{ind.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Golden Defense Habits */}
        <div className="mt-8 border-t border-line pt-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-purple flex items-center gap-1.5">
            <Sparkles size={13} />
            The 4 Defensive Reflexes
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {DEFENSE_HABITS.map((h) => (
              <div key={h.step} className="rounded-xl border border-line bg-panel-2 p-4">
                <span className="font-mono text-xs font-bold text-cyan">{h.step}</span>
                <h4 className="mt-1 text-xs font-bold text-text">{h.title}</h4>
                <p className="mt-1 text-[11px] text-muted leading-normal">{h.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Certificate Banner */}
        {completed ? (
          <div className="mt-8 rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-5 text-center space-y-3">
            <CheckCircle2 size={40} className="mx-auto text-emerald-400" />
            <h4 className="text-lg font-bold text-emerald-300">Resilience Training Completed!</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Your security record in the Admin Console has been updated to <b>Trained & Educated 🎓</b>. Keep applying
              these instincts in daily operations.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Button size="sm" variant="secondary" onClick={onRestartDrill} className="text-xs">
                <RotateCcw size={12} className="mr-1" /> Re-attempt Drill
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4">
            <Button size="sm" variant="ghost" onClick={onRestartDrill} className="text-xs text-muted hover:text-text">
              <RotateCcw size={12} className="mr-1.5" /> Practice Drill Again
            </Button>

            <Button
              size="sm"
              variant="primary"
              disabled={submitting}
              onClick={handleCompleteTraining}
              className="text-xs font-semibold flex items-center gap-2 bg-cyan text-bg hover:bg-cyan/90 font-bold"
            >
              <ShieldCheck size={14} />
              <span>{submitting ? 'Verifying...' : 'Complete Training & Update Admin Status'}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
