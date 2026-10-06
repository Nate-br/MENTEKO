import { useState, useEffect, type FormEvent } from 'react';
import type { DynamicDrill } from '@/data/dynamicDrills';
import { api } from '@/lib/api';
import { Clock, Check, Truck, Lock, Gift, Sparkles } from 'lucide-react';

interface IPhoneGiveawayDrillProps {
  drill?: DynamicDrill;
  token?: string;
  onComplete?: (result: { status: string; reactionTime?: number; payload?: any }) => void;
}

export function IPhoneGiveawayDrill({ drill: _drill, token, onComplete }: IPhoneGiveawayDrillProps) {
  // Countdown timer: 8 minutes 42 seconds
  const [secondsLeft, setSecondsLeft] = useState(522);
  const [selectedColor, setSelectedColor] = useState<'natural' | 'black' | 'desert'>('natural');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [appleId, setAppleId] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 1 ? s - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
            lure: 'iPhone 17 Pro Max Giveaway',
            claimedName: fullName,
            appleIdProvided: appleId,
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
        sessionRisk: 'Critical - Unverified Giveaway Claim & Apple ID Credential Submission',
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#f5f5f7] font-sans antialiased selection:bg-[#0071e3] selection:text-white">
      {/* Apple Brand Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#161617]/90 backdrop-blur-md border-b border-[#333336]">
        <div className="mx-auto max-w-5xl px-4 h-11 flex items-center justify-between text-xs text-[#d2d2d7]">
          {/* Apple Logo SVG */}
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.7-7.9-12-14.58-6.17-9.5-11-20.73-14.49-33.68-3.48-12.95-5.23-25.26-5.23-36.93 0-16.14 4.1-29.35 12.3-39.63 8.2-10.27 18.42-15.53 30.65-15.77 4.58 0 9.8 1.13 15.66 3.4 5.86 2.26 9.53 3.44 11.02 3.52 1.95 0 5.86-1.29 11.72-3.87 5.86-2.58 10.9-3.74 15.13-3.49 13.91.73 24.89 5.86 32.96 15.4-12.18 7.37-18.15 17.51-17.9 30.43.25 10.27 4.22 18.79 11.9 25.56 7.68 6.77 16.79 10.51 27.32 11.22-2.35 7.03-5.26 14.15-8.73 21.36zM119.22 31.86c0-7.85 2.87-15.22 8.61-22.12 5.74-6.9 12.79-10.74 21.15-11.52.13 1.25.19 2.37.19 3.36 0 7.74-3.01 15.34-9.03 22.8-6.02 7.46-13.16 11.45-21.43 11.98-.13-1.49-.19-2.99-.19-4.5z" />
            </svg>
            <span className="tracking-tight text-sm font-medium">Apple Rewards</span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-[11px] text-[#a1a1a6]">
            <span>Store</span>
            <span>Mac</span>
            <span>iPad</span>
            <span className="text-white font-medium">iPhone 17 Pro</span>
            <span>Watch</span>
            <span>Support</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
              <Check size={10} /> Verified Voucher
            </span>
          </div>
        </div>
      </header>

      {/* Urgent Reservation Banner */}
      <div className="bg-gradient-to-r from-[#b43ed8]/20 via-[#0071e3]/20 to-[#b43ed8]/20 border-b border-[#333336] py-2.5 px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-xs">
          <Clock size={13} className="text-[#0071e3] animate-pulse" />
          <span className="text-[#d2d2d7]">
            Allocation held for: <b className="font-mono text-white text-sm">{formatTime(secondsLeft)}</b> before forfeiture to backup winner.
          </span>
        </div>
      </div>

      {/* Main Claim Page Content */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {/* Top Headline */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1d1d1f] border border-[#333336] px-3.5 py-1 text-xs text-[#0071e3] font-medium">
            <Sparkles size={12} /> 2026 VIP Customer Appreciation Program
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Congratulations. Your iPhone 17 Pro Max is ready.
          </h1>
          <p className="text-sm sm:text-base text-[#86868b] max-w-xl mx-auto">
            Your email was selected in our annual customer reward allocation. Complete your priority courier reservation below to receive your complimentary 1TB Titanium device.
          </p>
        </div>

        {/* Product Visual & Claim Form Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Left: Device Visual Card */}
          <div className="lg:col-span-5 rounded-2xl border border-[#333336] bg-[#161617] p-6 space-y-6 text-center shadow-2xl">
            <div className="relative mx-auto w-48 h-64 rounded-3xl bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e] p-3 border border-[#3a3a3c] shadow-inner flex flex-col justify-between">
              {/* Dynamic Island */}
              <div className="mx-auto h-3 w-16 rounded-full bg-black"></div>

              {/* Screen Graphic */}
              <div className="flex-1 flex flex-col items-center justify-center space-y-2">
                <Gift size={42} className="text-[#0071e3]" />
                <p className="font-bold text-xs text-white">iPhone 17 Pro Max</p>
                <p className="font-mono text-[10px] text-[#86868b]">1TB Titanium</p>
              </div>

              {/* Bottom bar */}
              <div className="mx-auto h-1 w-14 rounded-full bg-white/30"></div>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Select Finish:</p>
              <div className="mt-3 flex justify-center gap-3">
                {[
                  { id: 'natural', name: 'Natural Titanium', hex: '#9a958e' },
                  { id: 'black', name: 'Space Black', hex: '#2b2c2e' },
                  { id: 'desert', name: 'Desert Titanium', hex: '#b3957f' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.id as any)}
                    className={`flex flex-col items-center gap-1 text-[10px] transition-all ${
                      selectedColor === c.id ? 'scale-105 font-bold text-white' : 'text-[#86868b] opacity-70'
                    }`}
                  >
                    <span
                      className={`h-6 w-6 rounded-full border-2 ${
                        selectedColor === c.id ? 'border-[#0071e3]' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div className="border-t border-[#262629] pt-4 space-y-1.5 text-xs text-left">
              <div className="flex justify-between text-[#86868b]">
                <span>Retail Value:</span>
                <span className="line-through">$1,499.00 USD</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>VIP Loyalty Voucher:</span>
                <span>-$1,499.00 (100% OFF)</span>
              </div>
              <div className="flex justify-between text-[#86868b]">
                <span>Priority Courier Shipping:</span>
                <span className="text-white">FREE</span>
              </div>
              <div className="border-t border-[#262629] pt-2 flex justify-between font-bold text-sm text-white">
                <span>Total Due Today:</span>
                <span className="text-emerald-400 font-mono">$0.00</span>
              </div>
            </div>
          </div>

          {/* Right: Claim & Verification Form */}
          <div className="lg:col-span-7 rounded-2xl border border-[#333336] bg-[#161617] p-6 sm:p-8 space-y-6 shadow-2xl">
            <div>
              <h2 className="text-xl font-bold text-white">Shipping Address & Claim Verification</h2>
              <p className="text-xs text-[#86868b] mt-1">
                Provide your priority delivery address and authenticate ownership to release the reserved tracking number.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Shipping Section */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#0071e3] uppercase tracking-wider flex items-center gap-1.5">
                  <Truck size={13} /> 1. Delivery Details
                </p>

                <div>
                  <label className="block text-xs text-[#86868b] mb-1">Recipient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abebe Kebede"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-[#333336] bg-[#1d1d1f] px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:border-[#0071e3] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#86868b] mb-1">Delivery Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="Bole Sub-City, House 420"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-xl border border-[#333336] bg-[#1d1d1f] px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:border-[#0071e3] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#86868b] mb-1">Phone (for Courier Tracking SMS)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+251 91 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-[#333336] bg-[#1d1d1f] px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:border-[#0071e3] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Identity Verification Section */}
              <div className="border-t border-[#262629] pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#0071e3] uppercase tracking-wider flex items-center gap-1.5">
                    <Lock size={13} /> 2. Account Ownership Verification
                  </p>
                  <span className="text-[10px] text-[#86868b]">Required to prevent bot fraud</span>
                </div>

                <div className="rounded-xl border border-[#333336] bg-[#1d1d1f] p-3 text-[11px] text-[#86868b] leading-relaxed">
                  Sign in with your Apple ID or primary work account to authorize release of voucher code <b>#APP-884920-VIP</b>.
                </div>

                <div>
                  <label className="block text-xs text-[#86868b] mb-1">Apple ID / Account Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com or appleid@icloud.com"
                    value={appleId}
                    onChange={(e) => setAppleId(e.target.value)}
                    className="w-full rounded-xl border border-[#333336] bg-[#1d1d1f] px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:border-[#0071e3] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#86868b] mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-[#333336] bg-[#1d1d1f] px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:border-[#0071e3] focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] active:scale-[0.99] text-white font-semibold py-3.5 px-6 text-sm shadow-[0_4px_20px_rgba(0,113,227,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  'Verifying Voucher & Reserving Dispatch...'
                ) : (
                  <>
                    <Check size={16} /> Confirm Reservation & Ship My iPhone 17 Pro Max
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-[#6e6e73] pt-2">
                <span className="flex items-center gap-1">
                  <Lock size={10} /> 256-Bit SSL Encrypted
                </span>
                <span>•</span>
                <span>Official Partner Distribution</span>
                <span>•</span>
                <span>No Payment Required</span>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Apple Footer */}
      <footer className="mt-16 border-t border-[#262629] bg-[#161617] py-8 text-[11px] text-[#6e6e73]">
        <div className="mx-auto max-w-5xl px-4 space-y-2 text-center sm:text-left sm:flex sm:justify-between sm:items-center">
          <div>
            Copyright © 2026 Apple Inc. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-[#86868b]">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
            <span>Sales and Refunds</span>
            <span>Legal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
