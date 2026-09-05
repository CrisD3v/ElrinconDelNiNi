'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { MangaPageLoader } from './manga-page-loader';
import { TornPanelError } from './torn-panel-error';
import { InkStampSuccess } from './ink-stamp-success';

export type FeedbackType = 'loading' | 'error' | 'success';

export interface FeedbackCardProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: FeedbackType;
  volumeLabel?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export function FeedbackCardRoot({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Solid matte editorial container - strictly NO glassmorphism, NO backdrop-blur
        'relative w-full max-w-md p-8 sm:p-10 rounded-2xl',
        'bg-[#18191a] border border-[#3e4242]',
        'shadow-2xl shadow-black text-center space-y-6',
        'animate-in fade-in-0 duration-300',
        className
      )}
      {...props}
    >
      {/* Decorative Manga Panel Corner Brackets */}
      <div
        data-testid="corner-tl"
        aria-hidden="true"
        className="absolute top-3 left-3 w-3.5 h-3.5 border-t-2 border-l-2 border-accent/60 rounded-tl-[3px] pointer-events-none"
      />
      <div
        data-testid="corner-tr"
        aria-hidden="true"
        className="absolute top-3 right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-accent/60 rounded-tr-[3px] pointer-events-none"
      />
      <div
        data-testid="corner-bl"
        aria-hidden="true"
        className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-accent/60 rounded-bl-[3px] pointer-events-none"
      />
      <div
        data-testid="corner-br"
        aria-hidden="true"
        className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-accent/60 rounded-br-[3px] pointer-events-none"
      />

      {/* Subtle interior hairline border */}
      <div
        aria-hidden="true"
        className="absolute inset-1.5 border border-dark-800 rounded-xl pointer-events-none"
      />

      <div className="relative z-10 space-y-6">{children}</div>
    </div>
  );
}

export function FeedbackCardVolume({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full',
        'bg-[#1f2121] border border-[#424646]',
        'text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-accent',
        'shadow-inner',
        className
      )}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
      {children}
    </div>
  );
}

export function FeedbackCardGraphic({
  type = 'loading',
  className,
}: {
  type?: FeedbackType;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto flex items-center justify-center pt-2', className)}>
      {type === 'loading' && <MangaPageLoader size="lg" showFilament={false} />}
      {type === 'error' && <TornPanelError size="lg" />}
      {type === 'success' && <InkStampSuccess size="lg" />}
    </div>
  );
}

export function FeedbackCardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-xl sm:text-2xl font-bold tracking-tight text-text-primary',
        'leading-snug',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function FeedbackCardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'text-sm text-text-secondary leading-relaxed max-w-sm mx-auto font-normal',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function FeedbackCardActions({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-center gap-3 pt-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * High-level convenient wrapper using compound components internally
 */
export function FeedbackCard({
  type = 'loading',
  volumeLabel,
  title,
  description,
  action,
  children,
  className,
  ...props
}: FeedbackCardProps) {
  const defaultVolumeLabel =
    volumeLabel ||
    (type === 'loading'
      ? 'MANUSCRITO · EN PROCESO'
      : type === 'error'
      ? 'ANOMALÍA · INTERRUPCIÓN'
      : 'ENTREGA · COMPLETADA');

  return (
    <FeedbackCardRoot className={className} {...props}>
      <FeedbackCardVolume>{defaultVolumeLabel}</FeedbackCardVolume>
      <FeedbackCardGraphic type={type} />

      {(title || description) && (
        <div className="space-y-2">
          {title && <FeedbackCardTitle>{title}</FeedbackCardTitle>}
          {description && <FeedbackCardDescription>{description}</FeedbackCardDescription>}
        </div>
      )}

      {action && <FeedbackCardActions>{action}</FeedbackCardActions>}
      {children}
    </FeedbackCardRoot>
  );
}

FeedbackCard.Root = FeedbackCardRoot;
FeedbackCard.Volume = FeedbackCardVolume;
FeedbackCard.Graphic = FeedbackCardGraphic;
FeedbackCard.Title = FeedbackCardTitle;
FeedbackCard.Description = FeedbackCardDescription;
FeedbackCard.Actions = FeedbackCardActions;
