import type { ReactNode } from 'react';

type Tone = 'cyan' | 'green' | 'purple' | 'blue' | 'muted' | 'danger';

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
}

const toneMap: Record<Tone, string> = {
  cyan: 'text-cyan border-cyan/30 bg-cyan/10',
  green: 'text-green border-green/30 bg-green/10',
  purple: 'text-purple border-purple/30 bg-purple/10',
  blue: 'text-blue border-blue/30 bg-blue/10',
  muted: 'text-muted border-line bg-panel-2',
  danger: 'text-[#dc2626] border-[#fecaca] bg-[#fef2f2]',
};

export function Badge({ children, tone = 'muted', icon, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs ${toneMap[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
