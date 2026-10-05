import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { DYNAMIC_DRILLS, getDrillById, type DynamicDrill } from '@/data/dynamicDrills';
import { BankWebmailDrill } from '@/components/simulation/drills/BankWebmailDrill';
import { CBEBirrPhoneDrill } from '@/components/simulation/drills/CBEBirrPhoneDrill';
import { TelebirrAppDrill } from '@/components/simulation/drills/TelebirrAppDrill';
import { DeepfakeAudioDrill } from '@/components/simulation/drills/DeepfakeAudioDrill';
import { M365OAuthDrill } from '@/components/simulation/drills/M365OAuthDrill';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

export function DrillView() {
  const { drillId } = useParams<{ drillId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || undefined;
  const drillParam = searchParams.get('drill') || drillId;

  const [drill, setDrill] = useState<DynamicDrill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDrill() {
      setLoading(true);

      // If token provided, load session from server
      if (token) {
        try {
          const res = await api.get<{ success: boolean; drill?: DynamicDrill; session?: any }>(
            `/drills/session/${token}`
          );
          if (res.success && res.drill) {
            if (isMounted) {
              setDrill(res.drill);
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn('Could not fetch server session, falling back to local definition:', e);
        }
      }

      // Fallback or direct drill ID
      const targetId = drillParam || 'drill-bank-webmail';
      const localDrill = getDrillById(targetId) || DYNAMIC_DRILLS[0];
      if (isMounted) {
        setDrill(localDrill);
        setLoading(false);
      }
    }

    loadDrill();

    return () => {
      isMounted = false;
    };
  }, [drillId, drillParam, token]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan" />
          <p className="mt-3 text-sm text-muted font-mono">INITIALIZING CYBER DRILL SIMULATOR...</p>
        </div>
      </div>
    );
  }

  if (!drill) {
    return (
      <div className="mx-auto max-w-2xl py-20 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h2 className="mt-4 text-2xl font-bold text-text">Simulation Drill Not Found</h2>
        <p className="mt-2 text-sm text-muted">The requested interactive cyber drill does not exist or has expired.</p>
        <Button variant="secondary" onClick={() => navigate('/simulate')} className="mt-6">
          <ArrowLeft size={14} className="mr-1.5" /> Return to Simulations
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top back navigation */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/simulate')}
          className="text-xs text-muted hover:text-text"
        >
          <ArrowLeft size={13} className="mr-1.5" /> All Simulations
        </Button>

        {token && (
          <div className="flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 font-mono text-[11px] text-cyan">
            <Sparkles size={11} />
            <span>LIVE SERVER DRILL SESSION ACTIVE</span>
          </div>
        )}
      </div>

      {/* Render the matching dynamic interactive drill component */}
      {drill.id === 'drill-cbe-birr' && (
        <CBEBirrPhoneDrill drill={drill} token={token} onComplete={() => {}} />
      )}

      {drill.id === 'drill-telebirr-fraud' && (
        <TelebirrAppDrill drill={drill} token={token} onComplete={() => {}} />
      )}

      {drill.id === 'drill-deepfake-audio' && (
        <DeepfakeAudioDrill drill={drill} token={token} onComplete={() => {}} />
      )}

      {drill.id === 'drill-m365-oauth' && (
        <M365OAuthDrill drill={drill} token={token} onComplete={() => {}} />
      )}

      {(drill.id === 'drill-bank-webmail' ||
        !['drill-cbe-birr', 'drill-telebirr-fraud', 'drill-deepfake-audio', 'drill-m365-oauth'].includes(drill.id)) && (
        <BankWebmailDrill drill={drill} token={token} onComplete={() => {}} />
      )}
    </div>
  );
}
