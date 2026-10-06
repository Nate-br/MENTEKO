import { useState, type FormEvent } from 'react';
import type { DynamicDrill } from '@/data/dynamicDrills';
import { api } from '@/lib/api';
import { Lock, AlertTriangle, ArrowRight, Phone } from 'lucide-react';

interface AuthenticCBEBirrPortalProps {
  drill?: DynamicDrill;
  token?: string;
  onComplete?: (result: { status: string; reactionTime?: number; payload?: any }) => void;
}

export function AuthenticCBEBirrPortal({ drill: _drill, token, onComplete }: AuthenticCBEBirrPortalProps) {
  const [phoneNumber, setPhoneNumber] = useState('+251 9');
  const [fullName, setFullName] = useState('');
  const [pin, setPin] = useState('');
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
            lure: 'CBE Birr Mobile KYC Portal',
            claimedPhone: phoneNumber,
            claimedName: fullName,
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
        sessionRisk: 'Critical - Unverified CBE Birr Mobile PIN Submission',
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#11071d] text-[#f3e8ff] font-sans antialiased selection:bg-[#7e22ce] selection:text-white flex flex-col justify-between">
      {/* CBE Official Top Bar */}
      <header className="border-b border-[#3b1259] bg-[#1d0b33]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* CBE Emblem */}
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6b21a8] via-[#7e22ce] to-[#f59e0b] text-white shadow-md shadow-[#7e22ce]/30">
              <span className="font-extrabold text-xs tracking-tighter">CBE</span>
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                <span>የኢትዮጵያ ንግድ ባንክ</span>
                <span className="text-[#a855f7]">|</span>
                <span className="text-[#f59e0b] font-semibold">CBE Birr</span>
              </div>
              <p className="text-[10px] text-[#c084fc]/70 uppercase tracking-wider">
                Commercial Bank of Ethiopia · Mobile KYC Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#f59e0b]/15 px-3 py-1 font-mono text-[11px] text-[#fbbf24] border border-[#f59e0b]/30">
              <Lock size={11} />
              <span>SSL 256-Bit Secured</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-10">
        <div className="w-full max-w-md">
          {/* Urgent KYC Warning Banner */}
          <div className="mb-4 rounded-2xl border border-[#f59e0b]/40 bg-[#2b1046] p-4 text-xs text-amber-200 shadow-xl flex items-start gap-3">
            <AlertTriangle size={20} className="text-[#f59e0b] shrink-0 mt-0.5 animate-pulse" />
            <div className="leading-relaxed">
              <p className="font-bold text-white text-sm">KYC Profile Verification Required</p>
              <p className="mt-1 text-[11px] text-[#e9d5ff]/90">
                Pursuant to National Bank of Ethiopia compliance regulations, your CBE Birr mobile account has been flagged for incomplete identity records. Update within <b>2 hours</b> to prevent suspension of all outgoing and incoming transactions.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-[#3b1259] bg-[#1a0a2f] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-[#2d0e47] pb-4">
              <h1 className="text-xl font-bold text-white">CBE Birr Customer Verification</h1>
              <p className="text-xs text-[#c084fc]/80 mt-1">
                Enter your registered mobile number and PIN to authenticate account ownership and restore full transaction permissions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#e9d5ff] mb-1.5">
                  Full Customer Name (as registered on CBE)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Abebe Kebede Wolde"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-[#4c1d76] bg-[#0d0417] px-3.5 py-2.5 text-xs text-white placeholder-[#6b359c] focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e9d5ff] mb-1.5">
                  Registered Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+251 91 123 4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded-xl border border-[#4c1d76] bg-[#0d0417] px-3.5 py-2.5 text-xs text-white placeholder-[#6b359c] focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] focus:outline-none transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e9d5ff] mb-1.5">
                  CBE Birr 4-Digit Security PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full rounded-xl border border-[#4c1d76] bg-[#0d0417] px-3.5 py-2.5 text-center text-lg tracking-widest text-amber-300 placeholder-[#6b359c] focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] focus:outline-none transition-colors"
                />
                <p className="mt-1 text-[10px] text-[#a855f7]">Required to authorize biometric re-enrollment.</p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-3 rounded-xl bg-gradient-to-r from-[#7e22ce] via-[#9333ea] to-[#f59e0b] hover:brightness-110 active:scale-[0.99] text-white font-semibold py-3.5 px-4 text-xs shadow-lg shadow-[#7e22ce]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  'Verifying KYC Records...'
                ) : (
                  <>
                    <span>Verify Profile & Unlock Account</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="border-t border-[#2d0e47] pt-4 text-center">
              <p className="text-[11px] text-[#a855f7] flex items-center justify-center gap-1.5">
                <Phone size={12} className="text-[#f59e0b]" />
                <span>For official CBE inquiries, dial customer helpline: <b>951</b></span>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2d0e47] bg-[#120622] py-6 text-[11px] text-[#a855f7]/80">
        <div className="mx-auto max-w-5xl px-4 text-center sm:text-left sm:flex sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            © 2026 Commercial Bank of Ethiopia (CBE). All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-[#c084fc]/70">
            <span>combanketh.et</span>
            <span>Security Statement</span>
            <span>Helpline 951</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
