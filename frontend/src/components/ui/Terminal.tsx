import type { ReactNode } from 'react';

interface TerminalProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function Terminal({ label, children, className = '' }: TerminalProps) {
  return (
    <div
      className={`relative rounded-2xl border border-white/20 bg-gradient-to-b from-[#140e24] via-[#0d0918] to-[#08050e] shadow-[0_24px_60px_-12px_rgba(143,30,174,0.35),0_12px_28px_-6px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] overflow-hidden backdrop-blur-xl ${className}`}
    >
      {/* Top Specular Rim Reflection */}
      <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#28173d] bg-[#1a122e]/90 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56] shadow-[0_0_6px_rgba(255,95,86,0.6)]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-[0_0_6px_rgba(255,189,46,0.6)]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f] shadow-[0_0_6px_rgba(39,201,63,0.6)]" />
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-[#bbaecf]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#27c93f] animate-pulse" />
          <span>{label}</span>
        </div>
        <span className="w-12" />
      </div>

      {/* Console Content */}
      <div className="p-6 font-mono text-[13px] leading-relaxed text-white">{children}</div>
    </div>
  );
}

interface TerminalLineProps {
  field: string;
  value: string;
  tone?: 'default' | 'cyan' | 'green' | 'purple' | 'muted';
}

const toneColor: Record<NonNullable<TerminalLineProps['tone']>, string> = {
  default: 'text-white font-medium',
  cyan: 'text-[#d672ff] font-semibold drop-shadow-[0_0_8px_rgba(214,114,255,0.5)]',
  green: 'text-[#46e6a5] font-semibold drop-shadow-[0_0_8px_rgba(70,230,165,0.4)]',
  purple: 'text-[#f472b6] font-semibold drop-shadow-[0_0_8px_rgba(244,114,182,0.4)]',
  muted: 'text-[#7d7192]',
};

export function TerminalLine({ field, value, tone = 'default' }: TerminalLineProps) {
  return (
    <div className="flex gap-2">
      <span className="text-[#8a7d9f]">{field}:</span>
      <span className={toneColor[tone]}>{value}</span>
    </div>
  );
}

export function TerminalCursor() {
  return (
    <span className="font-bold text-[#d672ff] animate-blink drop-shadow-[0_0_8px_rgba(214,114,255,0.6)]">
      ▋
    </span>
  );
}

