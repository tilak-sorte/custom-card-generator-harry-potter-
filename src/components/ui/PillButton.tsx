import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'ink' | 'accent' | 'ghost';

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  showArrow?: boolean;
}

const variants: Record<Variant, string> = {
  ink: 'border-ink text-ink',
  accent: 'border-current',
  ghost: 'border-ink/30 text-ink',
};

export default function PillButton({
  children,
  variant = 'ink',
  showArrow = false,
  className = '',
  type = 'button',
  ...rest
}: PillButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border-2 font-sans font-semibold transition hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`.trim()}
      {...rest}
    >
      {children}
      {showArrow && <span aria-hidden>↗</span>}
    </button>
  );
}