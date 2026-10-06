import { useState, type FormEvent } from 'react';
import type { DynamicDrill } from '@/data/dynamicDrills';
import { api } from '@/lib/api';
import { ShieldCheck, Lock, AlertTriangle, ArrowRight, HelpCircle } from 'lucide-react';

interface AuthenticBankPortalProps {
  drill?: DynamicDrill;
  token?: string;
  onComplete?: (result: { status: string; reactionTime?: number; payload?: any }) => void;
}

export function AuthenticBankPortal({ drill: _drill, token, onComplete }: AuthenticBankPortalProps) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (token) {
        const res = await api.post<any>('/drills/action', {
          token,
          action: 'submit_credentials',
          details: {
            entered: true,
            lure: 'Menteko Bank Online Portal',
            claimedUser: userId,
          },
        });
        onComplete?.({
          status: 'compromised',
          reactionTime: res?.reactionTime || 14,
          payload: res?.compromisedPayload,
        });
        return;
      }
    } catch (err) {
      console.warn('Telemetry error:', err);
    } finally {
      setSubmitting(false);
    }

    onComplete?.({
      status: 'compromised',
      reactionTime: 14,
      payload: {
        sessionRisk: 'Critical - Unverified Banking Portal Credential Submission',
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-[#e2e8f0] font-sans antialiased selection:bg-[#0284c7] selection:text-white flex flex-col justify-between">
      {/* Official Corporate Bank Header */}
      <header className="border-b border-[#1e293b] bg-[#0c1527]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Bank Emblem */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white shadow-md shadow-[#0284c7]/20">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                <span>MENTEKO NATIONAL BANK</span>
                <span className="rounded bg-[#0284c7]/20 border border-[#0284c7]/40 px-1.5 py-0.5 text-[9px] font-mono text-[#38bdf8] font-bold">
                  ONLINE
                </span>
              </div>
              <p className="text-[10px] text-[#64748b] tracking-wider uppercase font-medium">
                Personal & Commercial Financial Services
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 text-[#38bdf8] font-mono text-[11px] bg-[#0284c7]/10 border border-[#0284c7]/30 px-3 py-1 rounded-full">
              <Lock size={12} />
              <span>TLS 1.3 / 256-Bit SSL Secured</span>
            </div>
            <span className="text-[#64748b] hidden md:inline">Server ID: US-EAST-409</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-10">
        <div className="w-full max-w-md">
          {/* Urgent Security Banner */}
          <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-xs text-amber-200/90 shadow-lg flex items-start gap-2.5">
            <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <p className="font-bold text-amber-300">Identity Verification Required</p>
              <p className="mt-0.5 text-[11px] text-amber-200/80">
                An unrecognized sign-in was flagged from Frankfurt, Germany (IP 185.220.101.5). Verify your active Online Banking credentials to maintain full account access.
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl border border-[#1e293b] bg-[#0f1a2e] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-[#1e293b] pb-4">
              <h1 className="text-xl font-bold text-white tracking-tight">Sign In to Online Banking</h1>
              <p className="text-xs text-[#94a3b8] mt-1">
                Enter your credentials to confirm authorization and access your secure accounts.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5">
                  User ID / Customer Number
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. 104829104 or username"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full rounded-xl border border-[#334155] bg-[#080e1a] px-3.5 py-2.5 text-xs text-white placeholder-[#475569] focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#cbd5e1]">Password</label>
                  <a
                    href="#forgot"
                    onClick={(e) => e.preventDefault()}
                    className="text-[11px] text-[#38bdf8] hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#334155] bg-[#080e1a] px-3.5 py-2.5 text-xs text-white placeholder-[#475569] focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-[#94a3b8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberId}
                    onChange={(e) => setRememberId(e.target.checked)}
                    className="rounded border-[#334155] bg-[#080e1a] text-[#0284c7] focus:ring-0"
                  />
                  <span>Remember User ID</span>
                </label>

                <div className="flex items-center gap-1 text-[#64748b] text-[11px]">
                  <HelpCircle size={12} />
                  <span>Security Guarantee</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#075985] active:scale-[0.99] text-white font-semibold py-3 px-4 text-xs shadow-lg shadow-[#0284c7]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  'Authenticating Account...'
                ) : (
                  <>
                    <span>Sign In & Verify Account</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="border-t border-[#1e293b] pt-4 text-center space-y-2">
              <p className="text-[11px] text-[#64748b]">
                Not registered for Online Banking?{' '}
                <a href="#enroll" onClick={(e) => e.preventDefault()} className="text-[#38bdf8] hover:underline">
                  Enroll Now
                </a>
              </p>
            </div>
          </div>

          {/* Security Features Ribbon */}
          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[10px] text-[#64748b]">
            <div className="rounded-lg border border-[#1e293b] bg-[#0c1527] p-2">
              <p className="font-semibold text-[#94a3b8]">FDIC Insured</p>
              <p className="text-[9px] mt-0.5">Up to $250,000</p>
            </div>
            <div className="rounded-lg border border-[#1e293b] bg-[#0c1527] p-2">
              <p className="font-semibold text-[#94a3b8]">24/7 Fraud Guard</p>
              <p className="text-[9px] mt-0.5">Real-time alerts</p>
            </div>
            <div className="rounded-lg border border-[#1e293b] bg-[#0c1527] p-2">
              <p className="font-semibold text-[#94a3b8]">Biometric MFA</p>
              <p className="text-[9px] mt-0.5">Protected access</p>
            </div>
          </div>
        </div>
      </main>

      {/* Official Corporate Footer */}
      <footer className="border-t border-[#1e293b] bg-[#0a1120] py-6 text-[11px] text-[#64748b]">
        <div className="mx-auto max-w-6xl px-4 text-center sm:text-left sm:flex sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            © 2026 Menteko National Bank & Financial Services Corp. Member FDIC. Equal Housing Lender.
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-[#94a3b8]">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:underline">Privacy Policy</a>
            <a href="#security" onClick={(e) => e.preventDefault()} className="hover:underline">Security Center</a>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:underline">Terms of Service</a>
            <a href="#contact" onClick={(e) => e.preventDefault()} className="hover:underline">Contact 24/7 Helpline</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
