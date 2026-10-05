import type { Scenario } from '@/types';
import { Terminal, TerminalLine } from '@/components/ui/Terminal';

export function ScenarioContentView({ scenario }: { scenario: Scenario }) {
  const { content } = scenario;

  return (
    <Terminal label={`SIMULATION / ${scenario.format}`}>
      <div className="space-y-1 border-b border-white/10 pb-4 text-xs">
        {content.sender && <TerminalLine field="from" value={content.sender} tone="cyan" />}
        {content.fromName && !content.sender && (
          <TerminalLine
            field="from"
            value={content.fromEmail ? `${content.fromName} <${content.fromEmail}>` : content.fromName}
            tone="cyan"
          />
        )}
        {content.to && <TerminalLine field="to" value={content.to} tone="muted" />}
        {content.sentAt && <TerminalLine field="time" value={content.sentAt} tone="muted" />}
        {content.subject && <TerminalLine field="subject" value={content.subject} />}
        {content.attachmentLabel && (
          <TerminalLine field="attachment" value={content.attachmentLabel} tone="purple" />
        )}
        {content.linkDisplay && (
          <TerminalLine
            field="link"
            value={`${content.linkDisplay}${content.linkActual ? ` (target: ${content.linkActual})` : ''}`}
            tone="muted"
          />
        )}
        {content.meta &&
          Object.entries(content.meta).map(([key, value]) => (
            <TerminalLine key={key} field={key} value={value} tone="muted" />
          ))}
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-[#ece5f5] font-sans">{content.body}</p>

      {content.callToAction && (
        <div className="mt-5">
          <span className="inline-block rounded-md border border-cyan/40 bg-cyan/15 px-4 py-2 font-mono text-xs tracking-wide text-[#d672ff] shadow-[0_0_12px_rgba(143,30,174,0.25)]">
            {content.callToAction}
          </span>
        </div>
      )}
    </Terminal>
  );
}
