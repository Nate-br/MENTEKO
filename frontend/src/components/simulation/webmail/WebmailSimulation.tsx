import { useState } from 'react';
import type { Scenario } from '@/types';
import { TrainingSimulationBanner } from '@/components/simulation/webmail/TrainingSimulationBanner';
import { BrowserFrame } from '@/components/simulation/webmail/BrowserFrame';
import { WebmailShell } from '@/components/simulation/webmail/WebmailShell';
import { WebmailMessageView } from '@/components/simulation/webmail/WebmailMessageView';
import { LinkInspectBar } from '@/components/simulation/webmail/LinkInspectBar';
import { parseEmailContent } from '@/components/simulation/webmail/parseEmailContent';

interface WebmailSimulationProps {
  scenario: Scenario;
  showBanner?: boolean;
  ctaHint?: string;
  onCtaClick?: () => void;
}

export function WebmailSimulation({
  scenario,
  showBanner = true,
  ctaHint = 'If you would click this in real life, choose your action below.',
  onCtaClick,
}: WebmailSimulationProps) {
  const email = parseEmailContent(scenario);
  const [inspectActive, setInspectActive] = useState(false);

  const frameUrl = email.linkDisplay ?? 'https://mail.company.example/inbox';

  return (
    <div className="space-y-3">
      {showBanner && <TrainingSimulationBanner />}
      <BrowserFrame url={frameUrl}>
        <WebmailShell activeSubject={email.subject} activeSender={email.fromName}>
          <WebmailMessageView
            email={email}
            onCtaHover={setInspectActive}
            onCtaClick={onCtaClick}
            ctaHint={ctaHint}
          />
        </WebmailShell>
        <LinkInspectBar
          linkDisplay={email.linkDisplay}
          linkActual={email.linkActual}
          visible={inspectActive}
        />
      </BrowserFrame>
    </div>
  );
}
