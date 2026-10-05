import { useState } from 'react';
import type { DynamicDrill } from '@/data/dynamicDrills';
import { Button } from '@/components/ui/Button';
import {
  Wallet,
  Receipt,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { api } from '@/lib/api';

interface TelebirrAppDrillProps {
  drill: DynamicDrill;
  token?: string;
  onComplete?: (result: { status: string; reactionTime?: number }) => void;
}

export function TelebirrAppDrill({ drill, token, onComplete }: TelebirrAppDrillProps) {
  const [balance, setBalance] = useState(4850.0);
  const [activeTab, setActiveTab] = useState<'chat' | 'statement'>('chat');
  const [feedback, setFeedback] = useState<{
    status: 'safe' | 'compromised';
    title: string;
    message: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAction = async (action: string, isCompromised: boolean, title: string, message: string) => {
    setSubmitting(true);
    if (isCompromised) {
      setBalance((b) => b - 500.0);
    }
    try {
      if (token) {
        await api.post('/drills/action', {
          token,
          action,
          details: { isCompromised, currentBalance: balance },
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
          <span className="font-mono text-xs uppercase tracking-wider text-cyan">
            Interactive Payment Fraud Drill · {drill.category}
          </span>
          <h2 className="text-2xl font-bold text-text">{drill.title}</h2>
          <p className="text-sm text-muted">{drill.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan">
            Live Ledger Verification
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Telebirr App Simulator */}
        <div className="flex justify-center lg:col-span-6">
          <div className="relative w-full max-w-[340px] rounded-[42px] border-[8px] border-panel-2 bg-black p-3 shadow-2xl ring-1 ring-white/10">
            {/* Phone Screen */}
            <div className="min-h-[580px] rounded-[32px] bg-[#091b29] text-white flex flex-col justify-between overflow-hidden">
              {/* Telebirr Top Bar */}
              <div className="bg-[#0b5c96] px-4 py-3 text-white">
                <div className="flex items-center justify-between text-[11px] opacity-80 font-mono">
                  <span>Telebirr Mobile</span>
                  <span>11:15 AM</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-cyan">Available Balance</p>
                    <p className="text-xl font-bold tracking-tight">{balance.toFixed(2)} ETB</p>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
                    <Wallet size={18} />
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-4 flex gap-2 border-t border-white/10 pt-2 text-xs">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-1 rounded font-medium ${
                      activeTab === 'chat' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Incoming Claim
                  </button>
                  <button
                    onClick={() => setActiveTab('statement')}
                    className={`flex-1 py-1 rounded font-medium flex items-center justify-center gap-1 ${
                      activeTab === 'statement' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Receipt size={11} />
                    Official Statement
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                {feedback ? (
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
                        setFeedback(null);
                        setBalance(4850.0);
                        setActiveTab('chat');
                      }}
                      className="mt-3 text-xs w-full"
                    >
                      <RotateCcw size={12} className="mr-1" /> Reset Scenario
                    </Button>
                  </div>
                ) : activeTab === 'chat' ? (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-white/10 bg-[#0d273a] p-3 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-muted pb-1 border-b border-white/5">
                        <span>Message from 0922-441199</span>
                        <span>Just now</span>
                      </div>
                      <p className="mt-2 text-slate-200 leading-relaxed">
                        "Brother please! I sent 500 ETB to your number by mistake instead of my sister! My mom is in Tikur
                        Anbessa hospital and we need the medicine money immediately. Please reverse 500 ETB to 0922441199 right
                        now! See screenshot attached!"
                      </p>

                      {/* Fake Screenshot Preview */}
                      <div className="mt-3 rounded border border-amber-500/30 bg-amber-500/10 p-2 text-[10px] text-amber-300">
                        <p className="font-bold">📸 Attached Screenshot: telebirr_transfer_500.jpg</p>
                        <p className="opacity-80">"Transaction: 500.00 ETB to your phone... Status: Success"</p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-panel-2 p-2.5 text-center text-[11px] text-muted">
                      💡 Tip: Never rely on screenshots. Switch to <b>Official Statement</b> tab to verify your live ledger!
                    </div>
                  </div>
                ) : (
                  /* Official Statement View */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="font-semibold text-cyan">Live Ledger Transactions</span>
                      <span className="text-[10px] font-mono text-muted">Updated: 11:15 AM</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="rounded border border-line bg-panel-2 p-2 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-slate-200">Ethio Telecom Airtime</p>
                          <p className="text-[10px] text-muted">Yesterday, 4:15 PM</p>
                        </div>
                        <span className="font-mono text-slate-300">-100.00 ETB</span>
                      </div>

                      <div className="rounded border border-line bg-panel-2 p-2 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-slate-200">Salary Credit (Company)</p>
                          <p className="text-[10px] text-muted">3 days ago</p>
                        </div>
                        <span className="font-mono text-emerald-400 font-bold">+5,000.00 ETB</span>
                      </div>

                      {/* Scammer Ledger Result */}
                      <div className="rounded border border-red-500/30 bg-red-950/20 p-2 text-center text-xs">
                        <AlertOctagon size={18} className="mx-auto text-red-400 mb-1" />
                        <p className="font-bold text-red-300">No 500.00 ETB Deposit Found</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          No transaction received from 0922-441199 in the past 48 hours. The attached screenshot was fabricated!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Decision Bar inside phone */}
                {!feedback && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={submitting}
                      onClick={() =>
                        handleAction(
                          'verify_secondary',
                          false,
                          'Fraud Prevented via Official Ledger Verification!',
                          'You verified the transaction history before sending money. Scammers forge fake SMS receipts to trick victims into refunding non-existent deposits.'
                        )
                      }
                      className="w-full text-xs"
                    >
                      <ShieldCheck size={13} className="mr-1" />
                      Advise Official Reversal via 127
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={submitting}
                      onClick={() =>
                        handleAction(
                          'submit_credentials',
                          true,
                          'Financial Loss: 500 ETB Deducted!',
                          'You sent 500 ETB out of sympathy based on a fake screenshot. Because no money was ever sent to you, you lost 500 ETB of your own funds.'
                        )
                      }
                      className="w-full text-xs bg-red-600 hover:bg-red-500"
                    >
                      Quick Refund 500 ETB
                    </Button>
                  </div>
                )}
              </div>

              {/* Home indicator */}
              <div className="flex justify-center pb-2">
                <div className="h-1 w-24 rounded-full bg-white/20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Defensive Analysis */}
        <div className="flex flex-col justify-between space-y-6 lg:col-span-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Psychological Threat Vector</h3>
            <p className="text-sm text-muted">
              Wrong-number refund scams exploit human empathy (hospital emergency, crying parent) and urgency to prevent
              victims from checking their actual account balance.
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

          <div className="rounded-xl border border-line bg-panel-1 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan">Official Banking Rule</h4>
            <p className="mt-1 text-xs text-muted leading-relaxed">
              If someone genuinely made a mistaken deposit into your mobile wallet, only Ethio Telecom (call 127) can audit
              and perform a formal bank reversal. <b>Never manually send personal funds</b> to settle an alleged mistake.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
