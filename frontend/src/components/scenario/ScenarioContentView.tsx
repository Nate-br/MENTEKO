import type { Scenario } from '@/types';
import { Terminal, TerminalLine } from '@/components/ui/Terminal';

export function ScenarioContentView({ scenario }: { scenario: Scenario }) {
  const { content } = scenario;

  return (
    <Terminal label={`SIMULATION / ${scenario.format}`}>
      <div className="space-y-1 border-b border-line pb-4 text-xs">
        {content.sender && <TerminalLine field="from" value={content.sender} tone="cyan" />}
        {content.subject && <TerminalLine field="subject" value={content.subject} />}
        {content.meta &&
          Object.entries(content.meta).map(([key, value]) => (
            <TerminalLine key={key} field={key} value={value} tone="muted" />
          ))}
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-text font-sans">{content.body}</p>

      {content.callToAction && (
        <div className="mt-5">
          <span className="inline-block rounded-md border border-cyan/40 bg-cyan/10 px-4 py-2 font-mono text-xs tracking-wide text-cyan">
            {content.callToAction}
          </span>
        </div>
      )}
    </Terminal>
  );
}
