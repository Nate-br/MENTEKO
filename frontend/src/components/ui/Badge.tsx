import type { ReactNode } from 'react';

type Tone = 'cyan' | 'green' | 'purple' | 'blue' | 'muted' | 'danger';

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
}

const toneMap: Record<Tone, string> = {
  cyan: 'text-cyan border-cyan/30 bg-cyan/5',
  green: 'text-green border-green/30 bg-green/5',
  purple: 'text-purple border-purple/30 bg-purple/5',
  blue: 'text-blue border-blue/30 bg-blue/5',
  muted: 'text-muted border-line bg-panel-2',
  danger: 'text-[#ff6b6b] border-[#4a1f22] bg-[#1a0e0f]',
};

export function Badge({ children, tone = 'muted', icon }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs ${toneMap[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
}
