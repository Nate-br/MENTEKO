import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  ShieldAlert,
  ArrowRight,
  Terminal,
  Clock,
  Eye,
  KeyRound,
  Globe,
} from 'lucide-react';

interface BreachInterceptionModalProps {
  payload?: {
    ipAddress?: string;
    userAgent?: string;
    capturedFields?: string[];
    sessionRisk?: string;
  } | null;
  reactionTime?: number;
  onProceedToTraining: () => void;
}

export function BreachInterceptionModal({
  payload,
  reactionTime,
  onProceedToTraining,
}: BreachInterceptionModalProps) {
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const ip = payload?.ipAddress || '197.156.103.42';
  const userAgent = payload?.userAgent || navigator.userAgent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl border border-red-500/50 bg-[#0b1019] p-6 sm:p-8 shadow-[0_0_50px_rgba(239,68,68,0.25)] text-slate-100">
        {/* Header Alert */}
        <div className="flex items-center gap-3 border-b border-red-500/20 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 animate-pulse">
            <ShieldAlert size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/40">
                ⚠️ Live Simulation Alert
              </span>
              {reactionTime && (
                <span className="font-mono text-xs text-muted flex items-center gap-1">
                  <Clock size={11} /> Reaction: {reactionTime}s
                </span>
              )}
            </div>
            <h2 className="mt-1 text-xl font-bold text-white tracking-tight">
              Vulnerability Triggered: Account Compromised!
            </h2>
          </div>
        </div>

        {/* Breach Reality Explanation */}
        <div className="mt-5 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            In a real-world social engineering attack, clicking this link or submitting credentials would have granted an
            adversary <b>instant access to your session</b>.
          </p>

          {/* Terminal / Intercepted Telemetry Box */}
          <div className="rounded-xl border border-red-500/30 bg-black/60 p-4 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px] text-red-400">
              <span className="flex items-center gap-1.5 font-bold">
                <Terminal size={13} /> ADVERSARY HARVEST LOG
              </span>
              <span className="text-[10px] text-muted">TIMESTAMP: {new Date().toLocaleTimeString()}</span>
            </div>

            <div className="space-y-1.5 pt-1 text-[11px]">
              <div className="flex items-start gap-2">
                <Globe size={13} className="text-red-400 mt-0.5 shrink-0" />
                <span>
                  <b className="text-slate-400">Victim Origin IP:</b>{' '}
                  <span className="text-emerald-400">{ip}</span> (Addis Ababa, ET)
                </span>
              </div>

              <div className="flex items-start gap-2">
                <Eye size={13} className="text-red-400 mt-0.5 shrink-0" />
                <span className="truncate">
                  <b className="text-slate-400">Device Fingerprint:</b>{' '}
                  <span className="text-cyan">{userAgent.slice(0, 48)}...</span>
                </span>
              </div>

              <div className="flex items-start gap-2">
                <KeyRound size={13} className="text-red-400 mt-0.5 shrink-0" />
                <span>
                  <b className="text-slate-400">Payload Intercepted:</b>{' '}
                  <span className="text-amber-400 font-bold">Credential Hash Stolen [Session Hijacked]</span>
                </span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-muted italic">
              🔒 Controlled Training Environment: No actual passwords or banking details were recorded or stored.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-muted font-mono">
            Redirecting to Defense Training in <b className="text-cyan font-bold">{countdown}s</b>...
          </span>

          <Button
            variant="primary"
            onClick={onProceedToTraining}
            className="text-xs font-semibold flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white border-0 shadow-lg"
          >
            <span>Proceed to Teachable Training</span>
            <ArrowRight size={13} />
          </Button>
        </div>
      </div>
    </div>
  );
}
