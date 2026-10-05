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
  primary: 'bg-cyan text-white hover:bg-[#a738c8] active:bg-[#7b1696] shadow-[0_4px_16px_rgba(143,30,174,0.25)]',
  secondary:
    'bg-white/80 text-text border border-white/90 backdrop-blur-md hover:border-cyan/50 hover:text-cyan hover:bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)]',
  ghost: 'bg-transparent text-muted hover:text-text hover:bg-black/5',
  danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
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
