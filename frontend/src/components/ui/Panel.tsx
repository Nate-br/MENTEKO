import type { HTMLAttributes, ReactNode } from 'react';

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: 'cyan' | 'green' | 'purple' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const glowMap: Record<NonNullable<PanelProps['glow']>, string> = {
  cyan: 'border-cyan/40 shadow-[0_12px_36px_-6px_rgba(143,30,174,0.18)]',
  green: 'border-green/40 shadow-[0_12px_36px_-6px_rgba(16,126,71,0.15)]',
  purple: 'border-purple/40 shadow-[0_12px_36px_-6px_rgba(143,30,174,0.18)]',
  none: '',
};

const paddingMap: Record<NonNullable<PanelProps['padding']>, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Panel({
  children,
  glow = 'none',
  padding = 'md',
  className = '',
  ...rest
}: PanelProps) {
  return (
    <div
      className={`rounded-2xl border border-white/90 bg-white/75 backdrop-blur-xl shadow-[0_10px_30px_-5px_rgba(143,30,174,0.07),0_2px_8px_-2px_rgba(0,0,0,0.03),inset_0_1.5px_1px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(143,30,174,0.04)] transition-all duration-300 hover:shadow-[0_16px_38px_-6px_rgba(143,30,174,0.12)] hover:border-cyan/40 ${glowMap[glow]} ${paddingMap[padding]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
