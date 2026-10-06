import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { DYNAMIC_DRILLS, getDrillById, type DynamicDrill } from '@/data/dynamicDrills';
import { IPhoneGiveawayDrill } from '@/components/simulation/drills/IPhoneGiveawayDrill';
import { AuthenticBankPortal } from '@/components/simulation/drills/AuthenticBankPortal';
import { AuthenticCBEBirrPortal } from '@/components/simulation/drills/AuthenticCBEBirrPortal';
import { TelebirrAppDrill } from '@/components/simulation/drills/TelebirrAppDrill';
import { DeepfakeAudioDrill } from '@/components/simulation/drills/DeepfakeAudioDrill';
import { M365OAuthDrill } from '@/components/simulation/drills/M365OAuthDrill';
import { BreachInterceptionModal } from '@/components/simulation/BreachInterceptionModal';
import { TeachableMomentTraining } from '@/components/simulation/TeachableMomentTraining';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Loader2, AlertCircle, Eye } from 'lucide-react';
import { api } from '@/lib/api';

export function DrillView() {
  const { drillId } = useParams<{ drillId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || undefined;
  const drillParam = searchParams.get('drill') || drillId;

  const [drill, setDrill] = useState<DynamicDrill | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBreachModal, setShowBreachModal] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [breachPayload, setBreachPayload] = useState<any>(null);
  const [reactionTime, setReactionTime] = useState<number | undefined>(undefined);
  const [useTemplateIframe, setUseTemplateIframe] = useState(true);

  // Listen for Interception Bridge events emitted by HTML landing page templates
  useEffect(() => {
    const handleBridgeMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'MENTEKO_COMPROMISED') {
        handleDrillComplete({
          status: 'compromised',
          payload: {
            sessionRisk: 'Critical - Unverified Credential Entry on Phishing Landing Page Template',
          },
        });
      }
    };

    window.addEventListener('message', handleBridgeMessage);
    return () => window.removeEventListener('message', handleBridgeMessage);
  }, []);

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

  const handleDrillComplete = (result: { status: string; reactionTime?: number; payload?: any }) => {
    setReactionTime(result.reactionTime || 14);
    if (result.status === 'compromised') {
      setBreachPayload(
        result.payload || {
          sessionRisk: 'Critical - Unverified Click & Credential Entry',
        }
      );
      setShowBreachModal(true);
    } else {
      setShowTraining(true);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b13]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#8f1eae]" />
          <p className="mt-3 text-xs text-[#94a3b8] font-mono tracking-wider">CONNECTING TO SECURE GATEWAY...</p>
        </div>
      </div>
    );
  }

  if (!drill) {
    return (
      <div className="min-h-screen bg-[#070b13] flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h2 className="mt-4 text-2xl font-bold text-white">Simulation Session Expired</h2>
          <p className="mt-2 text-xs text-[#94a3b8]">
            The requested drill session could not be located or has expired.
          </p>
          <Button variant="secondary" onClick={() => navigate('/simulate')} className="mt-6 text-xs">
            <ArrowLeft size={13} className="mr-1.5" /> Return to Platform
          </Button>
        </div>
      </div>
    );
  }

  // If training mode has been activated after breach interception
  if (showTraining) {
    return (
      <div className="min-h-screen bg-[#070b13] px-4 py-8">
        <TeachableMomentTraining
          drill={drill}
          token={token}
          onRestartDrill={() => setShowTraining(false)}
          onFinished={() => {}}
        />
      </div>
    );
  }

  const templateUrl = `/api/drills/page/${token || `preview?drill=${drill.id}`}`;

  // Main interactive phishing landing page
  return (
    <div className="min-h-screen relative">
      {/* Top Admin / Preview Mode Bar (Only visible if opened WITHOUT a real employee token) */}
      {!token && (
        <aside aria-label="Simulation Preview Bar" className="sticky top-0 z-50 bg-[#0f172a] border-b border-[#334155] px-4 py-2 flex items-center justify-between text-xs text-[#94a3b8]">
          <div className="flex items-center gap-2">
            <Eye size={13} className="text-[#38bdf8]" />
            <span className="font-semibold text-white">Simulation Template Preview Mode</span>
            <span className="text-[#64748b]">·</span>
            <span className="font-mono text-[#cbd5e1]">{drill.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setUseTemplateIframe(!useTemplateIframe)}
              className="text-[11px] text-cyan hover:underline"
            >
              {useTemplateIframe ? 'Switch to Standalone UI' : 'Switch to Raw HTML Template'}
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/simulate')}
              className="text-xs text-[#94a3b8] hover:text-white h-7 px-2.5"
            >
              <ArrowLeft size={12} className="mr-1.5" /> Return to Platform
            </Button>
          </div>
        </aside>
      )}

      {/* Render via Industry-Standard Pre-built HTML Template Engine */}
      {useTemplateIframe ? (
        <iframe
          src={templateUrl}
          title={drill.title}
          className="w-full h-screen border-0 block"
          sandbox="allow-scripts allow-forms allow-same-origin"
          onError={() => setUseTemplateIframe(false)}
        />
      ) : (
        <>
          {drill.id === 'drill-iphone-giveaway' && (
            <IPhoneGiveawayDrill drill={drill} token={token} onComplete={handleDrillComplete} />
          )}

          {drill.id === 'drill-bank-webmail' && (
            <AuthenticBankPortal drill={drill} token={token} onComplete={handleDrillComplete} />
          )}

          {drill.id === 'drill-cbe-birr' && (
            <AuthenticCBEBirrPortal drill={drill} token={token} onComplete={handleDrillComplete} />
          )}

          {drill.id === 'drill-telebirr-fraud' && (
            <TelebirrAppDrill drill={drill} token={token} onComplete={handleDrillComplete} />
          )}

          {drill.id === 'drill-deepfake-audio' && (
            <DeepfakeAudioDrill drill={drill} token={token} onComplete={handleDrillComplete} />
          )}

          {drill.id === 'drill-m365-oauth' && (
            <M365OAuthDrill drill={drill} token={token} onComplete={handleDrillComplete} />
          )}

          {!['drill-iphone-giveaway', 'drill-bank-webmail', 'drill-cbe-birr', 'drill-telebirr-fraud', 'drill-deepfake-audio', 'drill-m365-oauth'].includes(
            drill.id
          ) && <AuthenticBankPortal drill={drill} token={token} onComplete={handleDrillComplete} />}
        </>
      )}

      {/* Breach Interception Modal (Simulates real-world impact before training) */}
      {showBreachModal && (
        <BreachInterceptionModal
          payload={breachPayload}
          reactionTime={reactionTime}
          onProceedToTraining={() => {
            setShowBreachModal(false);
            setShowTraining(true);
          }}
        />
      )}
    </div>
  );
}
