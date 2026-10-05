import { useState } from 'react';
import type { DynamicDrill } from '@/data/dynamicDrills';
import { Button } from '@/components/ui/Button';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Lock,
} from 'lucide-react';
import { api } from '@/lib/api';

interface M365OAuthDrillProps {
  drill: DynamicDrill;
  token?: string;
  onComplete?: (result: { status: string; reactionTime?: number }) => void;
}

export function M365OAuthDrill({ drill, token, onComplete }: M365OAuthDrillProps) {
  const [inspectedPublisher, setInspectedPublisher] = useState(false);
  const [inspectedScopes, setInspectedScopes] = useState(false);
  const [feedback, setFeedback] = useState<{
    status: 'safe' | 'compromised';
    title: string;
    message: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const oauth = drill.oauthDetails || {
    appName: 'Enterprise Cloud DocViewer v4.2',
    publisher: 'Unverified Publisher (Created 2 days ago)',
    verified: false,
    scopes: [
      {
        name: 'Mail.ReadWrite',
        risk: 'critical',
        description: 'Allows reading, composing, and deleting all corporate emails.',
      },
      {
        name: 'Files.ReadWrite.All',
        risk: 'critical',
        description: 'Grants access to exfiltrate all OneDrive and SharePoint files.',
      },
      {
        name: 'offline_access',
        risk: 'critical',
        description: 'Maintains permanent background access without requiring passwords.',
      },
    ],
  };

  const handleAction = async (action: string, isCompromised: boolean, title: string, message: string) => {
    setSubmitting(true);
    try {
      if (token) {
        await api.post('/drills/action', {
          token,
          action,
          details: { isCompromised, inspectedPublisher, inspectedScopes },
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
            Modern Cloud Threat · {drill.category}
          </span>
          <h2 className="text-2xl font-bold text-text">{drill.title}</h2>
          <p className="text-sm text-muted">{drill.subtitle}</p>
        </div>
        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
          Illicit OAuth Consent Attack
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Microsoft 365 OAuth Consent Dialog */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-2xl border border-line bg-white text-slate-800 p-6 shadow-2xl space-y-4">
            {/* Microsoft Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                  <span className="bg-[#f25022]"></span>
                  <span className="bg-[#7fba00]"></span>
                  <span className="bg-[#00a4ef]"></span>
                  <span className="bg-[#ffb900]"></span>
                </div>
                <span className="font-semibold text-sm text-slate-700">Microsoft 365</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">you@company.example</span>
            </div>

            {/* App Permission Title */}
            <div>
              <h3 className="text-lg font-bold text-slate-900">Permissions requested</h3>
              <p className="text-xs text-slate-500 mt-1">
                <b>{oauth.appName}</b> is requesting permission to access resources in your organization.
              </p>
            </div>

            {/* Publisher Warning Box */}
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 flex items-start gap-2.5">
              <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Unverified publisher: </span>
                <span>This application has not been verified by Microsoft.</span>
                <button
                  onClick={() => setInspectedPublisher(!inspectedPublisher)}
                  className="block mt-1 font-semibold text-amber-900 underline"
                >
                  {inspectedPublisher ? 'Hide Publisher Details' : 'Inspect Publisher Certificate'}
                </button>
              </div>
            </div>

            {inspectedPublisher && (
              <div className="rounded border border-slate-300 bg-slate-50 p-2.5 text-xs space-y-1 font-mono text-slate-700">
                <p>Publisher ID: <span className="text-red-600">unverified-app-99210</span></p>
                <p>Tenant Registration: <span className="text-red-600">Created 2 days ago (Free Trial)</span></p>
                <p>Domain: <span className="text-red-600">cloud-doc-sync-eu.net</span></p>
              </div>
            )}

            {/* Scopes List */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>This application will be able to:</span>
                <button
                  onClick={() => setInspectedScopes(!inspectedScopes)}
                  className="text-blue-600 hover:underline"
                >
                  {inspectedScopes ? 'Basic View' : 'Audit API Risk Scopes'}
                </button>
              </div>

              <div className="space-y-2">
                {oauth.scopes?.map((sc) => (
                  <div
                    key={sc.name}
                    className={`rounded-lg border p-2.5 text-xs transition-all ${
                      inspectedScopes && sc.risk === 'critical'
                        ? 'border-red-400 bg-red-50 text-red-900'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Lock size={12} className={sc.risk === 'critical' ? 'text-red-500' : 'text-slate-400'} />
                        {sc.name}
                      </span>
                      {inspectedScopes && sc.risk === 'critical' && (
                        <span className="rounded bg-red-200 px-1.5 py-0.5 text-[10px] font-bold text-red-800 uppercase">
                          Critical OAuth Trap
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] opacity-80">{sc.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Consent Notice */}
            <p className="text-[11px] text-slate-500 leading-normal">
              Accepting these permissions means that you allow this app to use your data as specified in their terms of
              service. You can revoke these permissions at any time via myapps.microsoft.com.
            </p>

            {/* Consent Buttons */}
            <div className="flex gap-3 pt-2 border-t border-slate-200">
              <Button
                variant="primary"
                onClick={() =>
                  handleAction(
                    'report_phishing',
                    false,
                    'Malicious OAuth Grant Blocked & Reported!',
                    'You detected that a simple spreadsheet viewer was requesting critical Mail.ReadWrite and offline_access permissions without publisher verification. Illicit consent grants bypass MFA entirely.'
                  )
                }
                disabled={submitting}
                className="flex-1 text-xs bg-slate-900 hover:bg-slate-800 text-white"
              >
                <ShieldCheck size={14} className="mr-1.5" />
                Reject & Report App to SOC
              </Button>

              <Button
                variant="danger"
                onClick={() =>
                  handleAction(
                    'submit_credentials',
                    true,
                    'Persistent Cloud Compromise!',
                    'You clicked Accept. The attacker now holds an OAuth refresh token that gives them full access to all your emails and cloud files even if you reset your password or have MFA enabled.'
                  )
                }
                disabled={submitting}
                className="flex-1 text-xs bg-red-600 hover:bg-red-500 text-white"
              >
                <AlertTriangle size={14} className="mr-1.5" />
                Accept & Grant Access
              </Button>
            </div>

            {feedback && (
              <div
                className={`rounded-xl border p-4 text-center space-y-2 mt-4 ${
                  feedback.status === 'safe'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                    : 'border-red-300 bg-red-50 text-red-900'
                }`}
              >
                {feedback.status === 'safe' ? (
                  <CheckCircle2 size={36} className="mx-auto text-emerald-600" />
                ) : (
                  <XCircle size={36} className="mx-auto text-red-600" />
                )}
                <h4 className="text-base font-bold">{feedback.title}</h4>
                <p className="text-xs leading-relaxed">{feedback.message}</p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setFeedback(null);
                    setInspectedPublisher(false);
                    setInspectedScopes(false);
                  }}
                  className="text-xs mt-2"
                >
                  <RotateCcw size={12} className="mr-1" /> Re-test Drill
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Technical Explanation */}
        <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Why Illicit Consent is Lethal</h3>
            <p className="text-sm text-muted">
              Modern attackers no longer steal passwords. In an <b>Illicit Consent Grant attack</b>, they trick you into
              approving a malicious Azure AD app that bypasses multi-factor authentication (MFA).
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan">Enterprise Defender Rule</h4>
            <p className="mt-1 text-xs text-muted leading-relaxed">
              Always inspect the permissions list before clicking "Accept". If a tool only needs to view a document, it
              should <b>never ask for mailbox read/write access</b> or offline access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
