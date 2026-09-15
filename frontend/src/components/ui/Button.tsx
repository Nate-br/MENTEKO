import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed rounded-md';

const variants: Record<Variant, string> = {
  primary: 'bg-cyan text-bg hover:bg-[#4eeef8] active:bg-[#17c4cf]',
  secondary:
    'bg-transparent text-text border border-line hover:border-cyan hover:text-cyan',
  ghost: 'bg-transparent text-muted hover:text-text',
  danger: 'bg-transparent text-[#ff6b6b] border border-[#4a1f22] hover:bg-[#1a0e0f]',
};

const sizes: Record<Size, string> = {
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-sm tracking-wide',
};

interface ButtonProps
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  as?: 'button';
}

interface LinkButtonProps extends BaseProps {
  as: 'link';
  to: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps | LinkButtonProps>(
  (props, ref) => {
    const { variant = 'primary', size = 'md', children, className = '' } = props;
    const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

    if (props.as === 'link') {
      const { to } = props;
      return (
        <Link to={to} className={classes}>
          {children}
        </Link>
      );
    }

    const { as: _as, ...rest } = props as ButtonProps;
    return (
      <button ref={ref} className={classes} {...rest}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
