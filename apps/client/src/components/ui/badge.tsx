import type { ReactNode } from 'react';

export type BadgeVariant = 'default' | 'accent' | 'muted';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'bg-dark-700 text-text-secondary border border-dark-600',
  accent:
    'bg-accent/15 text-accent border border-accent/30',
  muted:
    'bg-dark-800 text-text-muted border border-dark-700',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        text-xs font-medium rounded-full
        transition-colors duration-150
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
