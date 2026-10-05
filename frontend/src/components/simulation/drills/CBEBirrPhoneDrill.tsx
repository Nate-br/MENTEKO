import { useState } from 'react';
import type { DynamicDrill } from '@/data/dynamicDrills';
import { Button } from '@/components/ui/Button';
import {
  Smartphone,
  PhoneCall,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { api } from '@/lib/api';

interface CBEBirrPhoneDrillProps {
  drill: DynamicDrill;
  token?: string;
  onComplete?: (result: { status: string; reactionTime?: number }) => void;
}

export function CBEBirrPhoneDrill({ drill, token, onComplete }: CBEBirrPhoneDrillProps) {
  const [currentScreen, setCurrentScreen] = useState<'sms' | 'browser' | 'call' | 'reveal'>('sms');
  const [inspectedSender, setInspectedSender] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [feedback, setFeedback] = useState<{
    status: 'safe' | 'compromised';
    title: string;
    message: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const sms = drill.smsContent || {
    senderDisplay: 'CBE-Birr',
    senderRaw: '+251911448821',
    officialShortcode: '8951',
    message:
      'CBE Birr Alert: Your mobile banking account is temporarily suspended due to unverified KYC information. Update immediately at https://cbebirr-verify.com/login or all funds will be locked within 2 hours.',
    linkUrl: 'https://cbebirr-verify.com/login',
  };

  const handleAction = async (action: string, isCompromised: boolean, title: string, message: string) => {
    setSubmitting(true);
    try {
      if (token) {
        await api.post('/drills/action', {
          token,
          action,
          details: { isCompromised },
        });
      }
    } catch (e) {
      console.warn('Drill action telemetry logged locally:', e);
    } finally {
      setSubmitting(false);
      setFeedback({
        status: isCompromised ? 'compromised' : 'safe',
        title,
        message,
      });
      setCurrentScreen('reveal');
      onComplete?.({ status: isCompromised ? 'compromised' : 'reported' });
    }
  };

  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-cyan">
            Interactive Smishing Drill · {drill.category}
          </span>
          <h2 className="text-2xl font-bold text-text">{drill.title}</h2>
          <p className="text-sm text-muted">{drill.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-purple/30 bg-purple/10 px-3 py-1 text-xs font-semibold text-purple">
            Live Interactive Simulator
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Smartphone Simulator */}
        <div className="flex justify-center lg:col-span-6">
          <div className="relative w-full max-w-[340px] rounded-[42px] border-[8px] border-panel-2 bg-black p-3 shadow-2xl ring-1 ring-white/10">
            {/* Phone Speaker & Dynamic Island */}
            <div className="absolute left-1/2 top-4 h-4 w-28 -translate-x-1/2 rounded-full bg-panel-2/90 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-cyan/40"></div>
            </div>

            {/* Screen Inner */}
            <div className="min-h-[580px] rounded-[32px] bg-[#0c121d] p-4 pt-8 text-white flex flex-col justify-between">
              {/* Status bar */}
              <div className="flex items-center justify-between text-[11px] text-muted font-mono pb-3 border-b border-white/5">
                <span>Ethio Telecom 4G</span>
                <span>10:42 AM</span>
                <span>92% 🔋</span>
              </div>

              {/* Main Phone View */}
              {currentScreen === 'sms' && (
                <div className="my-auto space-y-4">
                  <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan/10 border border-cyan/30 text-cyan">
                      <Smartphone size={24} />
                    </div>
                    <h3 className="mt-2 text-sm font-semibold">{sms.senderDisplay}</h3>
                    <p className="text-[11px] text-muted">
                      {inspectedSender ? (
                        <span className="text-red-400 font-mono font-bold">
                          ORIGIN: {sms.senderRaw} (Not official 8951!)
                        </span>
                      ) : (
                        'Verified Contact Header'
                      )}
                    </p>
                  </div>

                  {/* SMS Bubble */}
                  <div className="rounded-2xl rounded-tl-sm bg-[#162234] border border-cyan/20 p-3.5 text-xs leading-relaxed shadow-lg">
                    <p className="text-slate-200">{sms.message}</p>
                    <button
                      onClick={() => setCurrentScreen('browser')}
                      className="mt-2 flex items-center gap-1 font-mono text-xs font-semibold text-cyan hover:underline break-all"
                    >
                      <ExternalLink size={12} />
                      {sms.linkUrl}
                    </button>
                    <span className="mt-2 block text-right text-[10px] text-muted">10:41 AM · Delivered</span>
                  </div>

                  {/* On-Screen Mobile Tools */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => setInspectedSender(!inspectedSender)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-line bg-panel-2/80 py-2 text-xs font-medium text-slate-300 hover:border-cyan/40"
                    >
                      <Search size={13} className="text-cyan" />
                      {inspectedSender ? 'Hide Header Inspector' : 'Inspect Sender Number'}
                    </button>

                    <button
                      onClick={() => setCurrentScreen('call')}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-purple/30 bg-purple/10 py-2 text-xs font-medium text-purple-300 hover:bg-purple/20"
                    >
                      <PhoneCall size={13} />
                      Call Official Helpline 951
                    </button>
                  </div>
                </div>
              )}

              {/* Mobile Browser View */}
              {currentScreen === 'browser' && (
                <div className="my-auto space-y-4">
                  <div className="flex items-center gap-2 rounded-lg bg-panel-2 border border-line px-2.5 py-1.5 text-[11px] text-slate-400">
                    <Lock size={12} className="text-amber-400" />
                    <span className="truncate font-mono text-amber-200">cbebirr-verify.com/login</span>
                  </div>

                  <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-3 text-center">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-red-400">Simulated Phishing Page</p>
                    <h4 className="mt-1 text-sm font-bold text-slate-100">CBE Birr KYC Verification</h4>
                    <p className="mt-1 text-[11px] text-slate-400">Enter your 4-digit mobile banking PIN to unlock funds.</p>

                    <input
                      type="password"
                      maxLength={4}
                      placeholder="• • • •"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className="mt-3 w-32 rounded border border-line bg-black/50 py-2 text-center text-lg tracking-widest text-cyan focus:outline-none focus:border-cyan"
                    />

                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setCurrentScreen('sms')}
                        className="flex-1 text-xs"
                      >
                        <ArrowLeft size={12} className="mr-1" /> Back
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleAction(
                            'submit_credentials',
                            true,
                            'PIN Compromised!',
                            'You entered your mobile banking PIN on an unauthorized phishing domain (cbebirr-verify.com). Attackers now hold full access to your funds.'
                          )
                        }
                        className="flex-1 text-xs bg-red-600 hover:bg-red-500 text-white"
                      >
                        Submit PIN
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Helpline Call View */}
              {currentScreen === 'call' && (
                <div className="my-auto space-y-4 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 animate-pulse">
                    <PhoneCall size={28} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">CBE Official Helpline (951)</h3>
                    <p className="text-xs text-emerald-400 font-mono">Connected · 00:14</p>
                  </div>
                  <div className="rounded-xl border border-line bg-panel-2 p-3 text-left text-xs leading-relaxed text-slate-300">
                    <p className="font-semibold text-cyan">Automated IVR Security Notice:</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      "Commercial Bank of Ethiopia reminds all customers: CBE will NEVER ask for your PIN, OTP, or send SMS
                      links to unlock your account. Report suspicious SMS to shortcode 808."
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      handleAction(
                        'verify_secondary',
                        false,
                        'Threat Neutralized via Helpline Verification!',
                        'By calling the official 951 helpline instead of tapping the SMS link, you confirmed that CBE never sends SMS unlock links.'
                      )
                    }
                    className="w-full text-xs"
                  >
                    Hang Up & Report to 808
                  </Button>
                </div>
              )}

              {/* Reveal View inside phone */}
              {currentScreen === 'reveal' && feedback && (
                <div className="my-auto space-y-3 text-center">
                  {feedback.status === 'safe' ? (
                    <CheckCircle2 size={44} className="mx-auto text-emerald-400" />
                  ) : (
                    <XCircle size={44} className="mx-auto text-red-400" />
                  )}
                  <h4 className="text-base font-bold text-slate-100">{feedback.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{feedback.message}</p>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setCurrentScreen('sms');
                      setFeedback(null);
                      setPinInput('');
                    }}
                    className="mt-3 text-xs w-full"
                  >
                    Restart Drill
                  </Button>
                </div>
              )}

              {/* Bottom Navigation Pill */}
              <div className="flex justify-center pt-2">
                <div className="h-1 w-24 rounded-full bg-white/20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Tactical Assessment & Indicators */}
        <div className="flex flex-col justify-between space-y-6 lg:col-span-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Defensive Analysis & Indicators</h3>
            <p className="text-sm text-muted">
              Smishing (SMS Phishing) attacks targeting mobile money apps like CBE Birr and Telebirr mimic official sender
              headers while embedding deceptive links.
            </p>

            <div className="space-y-3">
              {drill.indicators.map((ind, i) => (
                <div key={ind.id} className="rounded-xl border border-line bg-panel-2 p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan/10 font-mono text-[10px] font-bold text-cyan">
                      {i + 1}
                    </span>
                    <h4 className="text-sm font-semibold text-text">{ind.title}</h4>
                  </div>
                  <p className="mt-1 text-xs text-muted leading-relaxed pl-7">{ind.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="rounded-xl border border-line bg-panel-1 p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan">Action Decision</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                onClick={() =>
                  handleAction(
                    'report_phishing',
                    false,
                    'Reported to Ethio Telecom Fraud Desk (808)',
                    'You correctly identified the spoofed CBE-Birr notification and forwarded the threat vector to national cyber authorities without interacting with the link.'
                  )
                }
                disabled={submitting}
                className="flex-1 text-xs"
              >
                <ShieldCheck size={14} className="mr-1.5" />
                Report Scam to 808
              </Button>
              <Button
                variant="danger"
                onClick={() =>
                  handleAction(
                    'click_link',
                    true,
                    'Trapped by Urgent KYC Smish!',
                    'Clicking unverified links under artificial 2-hour pressure exposes your mobile device and credentials to harvesting.'
                  )
                }
                disabled={submitting}
                className="flex-1 text-xs"
              >
                <AlertTriangle size={14} className="mr-1.5" />
                Click Link & Enter PIN
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
