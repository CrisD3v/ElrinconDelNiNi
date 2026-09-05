'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'spinner' | 'pulse' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeClasses = {
  spinner: {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  },
  pulse: {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  },
  dots: {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  },
};

export function Loader({
  variant = 'spinner',
  size = 'md',
  label,
  className,
  ...props
}: LoaderProps) {
  return (
    <div
      role="status"
      aria-label={label || 'Cargando'}
      className={cn('inline-flex flex-col items-center justify-center gap-2', className)}
      {...props}
    >
      {variant === 'spinner' && (
        <div
          className={cn(
            'rounded-full border-accent border-t-transparent animate-spin shadow-sm',
            sizeClasses.spinner[size]
          )}
        />
      )}

      {variant === 'pulse' && (
        <div className="relative flex items-center justify-center">
          <div
            className={cn(
              'rounded-full bg-accent animate-ping opacity-75 absolute inset-0',
              sizeClasses.pulse[size]
            )}
          />
          <div
            className={cn(
              'rounded-full bg-accent shadow-lg shadow-accent/40 relative',
              sizeClasses.pulse[size]
            )}
          />
        </div>
      )}

      {variant === 'dots' && (
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              'rounded-full bg-accent animate-bounce [animation-delay:-0.3s]',
              sizeClasses.dots[size]
            )}
          />
          <div
            className={cn(
              'rounded-full bg-accent animate-bounce [animation-delay:-0.15s]',
              sizeClasses.dots[size]
            )}
          />
          <div
            className={cn(
              'rounded-full bg-accent animate-bounce',
              sizeClasses.dots[size]
            )}
          />
        </div>
      )}

      {label && (
        <span className="text-xs font-medium text-text-secondary animate-pulse">
          {label}
        </span>
      )}
      <span className="sr-only">{label || 'Cargando...'}</span>
    </div>
  );
}
