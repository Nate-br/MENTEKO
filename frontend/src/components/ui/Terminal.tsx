import type { ReactNode } from 'react';

interface TerminalProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function Terminal({ label, children, className = '' }: TerminalProps) {
  return (
    <div
      className={`rounded-xl border border-line bg-panel-2/80 backdrop-blur-sm overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#3a4652]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3a4652]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3a4652]" />
        </div>
        <span className="font-mono text-[11px] tracking-wider text-muted">{label}</span>
        <span className="w-12" />
      </div>
      <div className="p-5 font-mono text-[13px] leading-relaxed">{children}</div>
    </div>
  );
}

interface TerminalLineProps {
  field: string;
  value: string;
  tone?: 'default' | 'cyan' | 'green' | 'purple' | 'muted';
}

const toneColor: Record<NonNullable<TerminalLineProps['tone']>, string> = {
  default: 'text-text',
  cyan: 'text-cyan',
  green: 'text-green',
  purple: 'text-purple',
  muted: 'text-muted',
};

export function TerminalLine({ field, value, tone = 'default' }: TerminalLineProps) {
  return (
    <div className="flex gap-2">
      <span className="text-muted">{field}:</span>
      <span className={toneColor[tone]}>{value}</span>
    </div>
  );
}

export function TerminalCursor() {
  return <span className="animate-blink text-cyan">▋</span>;
}
