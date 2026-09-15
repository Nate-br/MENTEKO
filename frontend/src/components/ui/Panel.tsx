import type { HTMLAttributes, ReactNode } from 'react';

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: 'cyan' | 'green' | 'purple' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const glowMap: Record<NonNullable<PanelProps['glow']>, string> = {
  cyan: 'shadow-[0_0_0_1px_var(--color-line),0_0_40px_-20px_var(--color-cyan)]',
  green: 'shadow-[0_0_0_1px_var(--color-line),0_0_40px_-20px_var(--color-green)]',
  purple: 'shadow-[0_0_0_1px_var(--color-line),0_0_40px_-20px_var(--color-purple)]',
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
      className={`rounded-xl border border-line bg-panel ${glowMap[glow]} ${paddingMap[padding]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
