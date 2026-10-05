import type { Scenario, ScenarioContent } from '@/types';

export interface ParsedEmail {
  fromName: string;
  fromEmail: string;
  to: string;
  sentAt: string;
  subject: string;
  body: string;
  callToAction?: string;
  linkDisplay?: string;
  linkActual?: string;
  attachmentLabel?: string;
  organizationNote?: string;
}

function parseSender(sender: string): { fromName: string; fromEmail: string } {
  const angle = sender.match(/^(.+?)\s*<([^>]+)>$/);
  if (angle) {
    return { fromName: angle[1].trim(), fromEmail: angle[2].trim() };
  }
  if (sender.includes('@')) {
    return { fromName: sender.split('@')[0], fromEmail: sender.trim() };
  }
  return { fromName: sender.trim(), fromEmail: '' };
}

export function parseEmailContent(scenario: Scenario): ParsedEmail {
  const { content } = scenario;
  const c = content as ScenarioContent & {
    fromName?: string;
    fromEmail?: string;
    to?: string;
    sentAt?: string;
    linkDisplay?: string;
    linkActual?: string;
    attachmentLabel?: string;
  };

  const fromSender = content.sender ? parseSender(content.sender) : { fromName: 'Unknown', fromEmail: '' };

  return {
    fromName: c.fromName ?? fromSender.fromName,
    fromEmail: c.fromEmail ?? c.meta?.fromEmail ?? fromSender.fromEmail,
    to: c.to ?? c.meta?.to ?? 'you@company.example',
    sentAt: c.sentAt ?? c.meta?.sentAt ?? 'Mon 9:14 AM',
    subject: content.subject ?? '(No subject)',
    body: content.body,
    callToAction: content.callToAction,
    linkDisplay: c.linkDisplay ?? c.meta?.linkDisplay ?? c.meta?.link,
    linkActual: c.linkActual ?? c.meta?.linkActual,
    attachmentLabel: c.attachmentLabel ?? c.meta?.attachment,
    organizationNote: c.meta?.organization,
  };
}

const EMAIL_FORMATS = new Set(['EMAIL', 'MESSAGE', 'EMAIL + ATTACHMENT']);

export function isWebmailScenario(scenario: Scenario): boolean {
  const format = scenario.format.toUpperCase();
  if (EMAIL_FORMATS.has(format)) {
    return Boolean(scenario.content.subject ?? scenario.content.sender);
  }
  return false;
}
