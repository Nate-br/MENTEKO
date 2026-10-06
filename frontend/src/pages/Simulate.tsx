import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScenarios } from '@/hooks/useScenarios';
import { useSession } from '@/hooks/useSession';
import { ScenarioCard } from '@/components/scenario/ScenarioCard';
import { DYNAMIC_DRILLS } from '@/data/dynamicDrills';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  Smartphone,
  Wallet,
  Activity,
  ShieldCheck,
  Mail,
  ArrowRight,
  Clock,
  Layers,
  Gift,
} from 'lucide-react';

const FILTER_ITEMS = [
  { id: 'all', label: 'All Categories' },
  { id: 'phishing', label: 'Phishing' },
  { id: 'impersonation', label: 'Impersonation' },
  { id: 'payment-fraud', label: 'Payment Fraud' },
  { id: 'fake-evidence', label: 'Fake Evidence' },
  { id: 'baiting', label: 'Baiting (USB/QR)' },
  { id: 'scareware', label: 'Scareware' },
  { id: 'social-engineering', label: 'Social Engineering' },
];

export function Simulate() {
  const navigate = useNavigate();
  const { scenarios, loading } = useScenarios();
  const { attempts } = useSession();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const completedIds = new Set(attempts.map((a) => a.scenario._id));

  const filteredScenarios = scenarios.filter((s) => {
    if (activeFilter === 'all') return true;
    return s.category === activeFilter;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="border-b border-line pb-8">
        <p className="font-mono text-xs tracking-wide text-cyan">MENTEKO ACTIVE RESILIENCE SUITE</p>
        <h1 className="mt-3 text-3xl font-semibold text-text sm:text-4xl">Simulation Center</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted leading-relaxed">
          Master real-world social engineering defense. Experience dynamic, multi-step smartphone simulators, live wallet
          verifications, AI audio forensics, and enterprise email drills integrated with the live server.
        </p>
      </div>

      {/* SECTION 1: Dynamic Interactive Cyber Drills */}
      <div className="mt-12 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
              <Sparkles size={14} />
            </span>
            <h2 className="text-xl font-bold text-text">Dynamic Interactive Cyber Drills</h2>
            <span className="rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-cyan uppercase tracking-wider">
              Live Server Engine
            </span>
          </div>
          <span className="font-mono text-xs text-muted">{DYNAMIC_DRILLS.length} Multi-Phase Hands-On Environments</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DYNAMIC_DRILLS.map((drill) => {
            const isSmishing = drill.id === 'drill-cbe-birr';
            const isWallet = drill.id === 'drill-telebirr-fraud';
            const isAudio = drill.id === 'drill-deepfake-audio';
            const isOAuth = drill.id === 'drill-m365-oauth';
            const isRewards = drill.id === 'drill-iphone-giveaway';

            return (
              <div
                key={drill.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-line bg-panel-1 p-5 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-cyan/50 hover:shadow-cyan/5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel-2 px-2.5 py-1 text-[11px] font-medium text-slate-300">
                      {isRewards && <Gift size={12} className="text-[#38bdf8]" />}
                      {isSmishing && <Smartphone size={12} className="text-cyan" />}
                      {isWallet && <Wallet size={12} className="text-cyan" />}
                      {isAudio && <Activity size={12} className="text-purple" />}
                      {isOAuth && <ShieldCheck size={12} className="text-amber-400" />}
                      {!isRewards && !isSmishing && !isWallet && !isAudio && !isOAuth && <Mail size={12} className="text-cyan" />}
                      <span className="capitalize">{drill.format.replace('DYNAMIC_', '').toLowerCase()}</span>
                    </span>

                    <span className="flex items-center gap-1 font-mono text-[11px] text-muted">
                      <Clock size={11} /> {drill.estimatedMinutes} min
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-text group-hover:text-cyan transition-colors">
                    {drill.title}
                  </h3>
                  <p className="mt-1 text-xs font-mono text-muted">{drill.subtitle}</p>
                  <p className="mt-3 text-xs text-muted leading-relaxed line-clamp-3">{drill.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {drill.serverEmailSupport && (
                      <span className="rounded bg-panel-2 px-2 py-0.5 text-[10px] font-mono text-cyan border border-cyan/20">
                        SMTP Mail Ready
                      </span>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => navigate(`/drills/${drill.id}`)}
                    className="flex items-center gap-1 text-xs font-semibold"
                  >
                    <span>Launch Drill</span>
                    <ArrowRight size={12} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Base Knowledge Assessments */}
      <div className="mt-20 border-t border-line pt-12 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-panel-2 text-slate-400">
              <Layers size={14} />
            </span>
            <h2 className="text-xl font-bold text-text">Base Threat Vector Assessments</h2>
            <span className="rounded-full border border-line bg-panel-2 px-2.5 py-0.5 font-mono text-[10px] font-bold text-muted uppercase">
              15 Standard Scenarios
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_ITEMS.map((item) => {
            const isActive = activeFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveFilter(item.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan text-bg shadow-sm font-semibold'
                    : 'bg-panel-2 border border-line text-muted hover:text-text hover:border-cyan/30'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <p className="mt-8 font-mono text-sm text-muted">loading scenarios…</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredScenarios.map((scenario, i) => (
              <ScenarioCard
                key={scenario._id}
                scenario={scenario}
                index={i}
                completed={completedIds.has(scenario._id)}
              />
            ))}
          </div>
        )}

        {attempts.length > 0 && (
          <div className="mt-8 flex items-center gap-3 font-mono text-xs text-muted">
            <span className="text-green">{attempts.length}</span> of {scenarios.length} completed this session
          </div>
        )}
      </div>
    </div>
  );
}
