import { useState, useRef } from 'react';
import type { DynamicDrill } from '@/data/dynamicDrills';
import { Button } from '@/components/ui/Button';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Activity,
  PhoneCall,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { api } from '@/lib/api';

interface DeepfakeAudioDrillProps {
  drill: DynamicDrill;
  token?: string;
  onComplete?: (result: { status: string; reactionTime?: number }) => void;
}

export function DeepfakeAudioDrill({ drill, token, onComplete }: DeepfakeAudioDrillProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [verifiedOutOfBand, setVerifiedOutOfBand] = useState(false);
  const [feedback, setFeedback] = useState<{
    status: 'safe' | 'compromised';
    title: string;
    message: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const startSyntheticAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 1.5);
      osc.frequency.setValueAtTime(160, ctx.currentTime + 1.8);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 3.0);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 3.6);

      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
      }, 3600);
    } catch (e) {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  const handleAction = async (action: string, isCompromised: boolean, title: string, message: string) => {
    setSubmitting(true);
    try {
      if (token) {
        await api.post('/drills/action', {
          token,
          action,
          details: { isCompromised, verifiedOutOfBand, analyzed },
        });
      }
    } catch (e) {
      console.warn('Drill action logged locally:', e);
    } finally {
      setSubmitting(false);
      setFeedback({
        status: isCompromised ? 'compromised' : 'safe',
        title,
        message,
      });
      onComplete?.({ status: isCompromised ? 'compromised' : 'reported' });
    }
  };

  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-purple">
            AI Voice Synthesis Defense · {drill.category}
          </span>
          <h2 className="text-2xl font-bold text-text">{drill.title}</h2>
          <p className="text-sm text-muted">{drill.subtitle}</p>
        </div>
        <span className="rounded-full border border-purple/30 bg-purple/10 px-3 py-1 text-xs font-semibold text-purple">
          Audio Waveform Forensics
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Audio Player & Forensic Analyzer */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-2xl border border-line bg-panel-2 p-6 shadow-xl space-y-5">
            {/* Caller Identity */}
            <div className="flex items-center gap-3 border-b border-line pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple/20 border border-purple/40 text-purple font-bold">
                MD
              </div>
              <div>
                <h4 className="text-base font-bold text-text">Dr. Dawit (Managing Director)</h4>
                <p className="text-xs text-muted">Corporate Telegram Voice Memo · Marked Urgent 🚨</p>
              </div>
            </div>

            {/* Audio Waveform Player */}
            <div className="rounded-xl border border-purple/30 bg-[#0d1424] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  {isPlaying ? <Volume2 size={14} className="text-purple animate-pulse" /> : <VolumeX size={14} className="text-muted" />}
                  Urgent Wire Authorization Memo.ogg
                </span>
                <span className="font-mono text-[11px] text-purple">0:24</span>
              </div>

              {/* Animated Waveform Bars */}
              <div className="flex items-center justify-between gap-1 h-12 py-2 px-1">
                {[18, 42, 65, 80, 50, 25, 70, 95, 88, 45, 30, 60, 85, 75, 40, 20, 55, 90, 60, 35, 15].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: isPlaying ? `${Math.min(100, h * (0.6 + Math.random() * 0.7))}%` : '20%' }}
                    className={`w-full rounded-full transition-all duration-150 ${
                      isPlaying ? 'bg-gradient-to-t from-purple to-cyan' : 'bg-line'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={startSyntheticAudio}
                  disabled={isPlaying}
                  className="text-xs"
                >
                  {isPlaying ? (
                    <>
                      <Square size={12} className="mr-1.5 fill-current" /> Playing Audio...
                    </>
                  ) : (
                    <>
                      <Play size={12} className="mr-1.5 fill-current" /> Play Voice Memo
                    </>
                  )}
                </Button>
                <span className="text-[11px] text-muted italic">Click to listen to AI synthesized memo</span>
              </div>
            </div>

            {/* Transcript of the memo */}
            <div className="rounded-lg bg-panel-1 border border-line p-3 text-xs leading-relaxed text-slate-300">
              <span className="font-semibold text-purple">Spoken Transcript:</span>
              <p className="mt-1 italic text-slate-300">
                "Hello, I am boarding an emergency flight to Dubai right now. We need you to wire 150,000 ETB ($1,250 USD)
                immediately to vendor TechCorp before the close of business. Do not wait for standard PO approval; execute
                the transfer now and I will sign off when I land tonight."
              </p>
            </div>

            {/* Forensic Inspection Tools */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setAnalyzed(true)}
                className={`flex items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition-all ${
                  analyzed
                    ? 'border-purple bg-purple/20 text-purple-200'
                    : 'border-line bg-panel-1 text-slate-300 hover:border-purple/40'
                }`}
              >
                <Activity size={14} className="text-purple" />
                {analyzed ? 'Spectral Analysis Complete' : 'Run AI Voice Analyzer'}
              </button>

              <button
                onClick={() => setVerifiedOutOfBand(true)}
                className={`flex items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition-all ${
                  verifiedOutOfBand
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-line bg-panel-1 text-slate-300 hover:border-emerald-500/40'
                }`}
              >
                <PhoneCall size={14} className="text-emerald-400" />
                {verifiedOutOfBand ? 'Office Verified: No Wire' : 'Call Known Office Landline'}
              </button>
            </div>

            {/* Analyzer Results */}
            {analyzed && (
              <div className="rounded-xl border border-purple/40 bg-purple/10 p-3 text-xs space-y-1">
                <p className="font-bold text-purple-300">🔍 Forensic Analysis: 94% Probability of AI Voice Clone</p>
                <ul className="list-disc pl-4 text-[11px] text-slate-300 space-y-0.5">
                  <li>Zero room acoustic reverberation (direct digital synthesizer artifact).</li>
                  <li>Synthetic breathing gaps: speech continuity lacks organic diaphragmatic pauses.</li>
                  <li>Pitch contour matches ElevenLabs / Resemble AI neural cloning model.</li>
                </ul>
              </div>
            )}

            {verifiedOutOfBand && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs space-y-1">
                <p className="font-bold text-emerald-300">📞 Secondary Verification Result:</p>
                <p className="text-[11px] text-slate-300">
                  You reached the executive assistant at the office. Dr. Dawit is in the 4th-floor boardroom, not on an
                  airplane, and has authorized no emergency offshore wire transfer.
                </p>
              </div>
            )}

            {feedback && (
              <div className="rounded-xl border border-line bg-panel-1 p-4 text-center space-y-2">
                {feedback.status === 'safe' ? (
                  <CheckCircle2 size={36} className="mx-auto text-emerald-400" />
                ) : (
                  <XCircle size={36} className="mx-auto text-red-400" />
                )}
                <h4 className="text-base font-bold text-slate-100">{feedback.title}</h4>
                <p className="text-xs text-slate-300">{feedback.message}</p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setFeedback(null);
                    setAnalyzed(false);
                    setVerifiedOutOfBand(false);
                  }}
                  className="text-xs mt-2"
                >
                  <RotateCcw size={12} className="mr-1" /> Reset Drill
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Tactical Assessment & Actions */}
        <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Deepfake Threat Protocol</h3>
            <p className="text-sm text-muted">
              Generative AI allows threat actors to clone any executive's voice using only 30 seconds of public speech from
              interviews, YouTube, or conference keynotes.
            </p>

            <div className="space-y-3">
              {drill.indicators.map((ind, i) => (
                <div key={ind.id} className="rounded-xl border border-line bg-panel-2 p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple/10 font-mono text-[10px] font-bold text-purple">
                      {i + 1}
                    </span>
                    <h4 className="text-sm font-semibold text-text">{ind.title}</h4>
                  </div>
                  <p className="mt-1 text-xs text-muted leading-relaxed pl-7">{ind.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-line bg-panel-1 p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-purple">Executive Action</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                onClick={() =>
                  handleAction(
                    'report_phishing',
                    false,
                    'Deepfake Wire Fraud Successfully Stopped!',
                    'You resisted urgency, used forensic verification, and confirmed via a separate out-of-band channel before executing any payment.'
                  )
                }
                disabled={submitting}
                className="flex-1 text-xs"
              >
                <ShieldCheck size={14} className="mr-1.5" />
                Reject & Report Fraud
              </Button>

              <Button
                variant="danger"
                onClick={() =>
                  handleAction(
                    'submit_credentials',
                    true,
                    'Critical Failure: 150,000 ETB Lost!',
                    'You authorized a wire transfer based purely on synthetic voice audio without out-of-band verification. Funds sent to fraudulent accounts are irreversible.'
                  )
                }
                disabled={submitting}
                className="flex-1 text-xs bg-red-600 hover:bg-red-500"
              >
                <AlertTriangle size={14} className="mr-1.5" />
                Execute Wire Transfer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
