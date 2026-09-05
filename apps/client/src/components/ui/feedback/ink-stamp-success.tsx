'use client';

import React, { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createTimeline } from 'animejs';

export interface InkStampSuccessProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  showIconBadge?: boolean;
}

const sizeConfig = {
  sm: { container: 'w-12 h-12', svgWidth: 48, svgHeight: 48, iconSize: 12 },
  md: { container: 'w-20 h-20', svgWidth: 76, svgHeight: 76, iconSize: 14 },
  lg: { container: 'w-28 h-28', svgWidth: 96, svgHeight: 96, iconSize: 16 },
};

export function InkStampSuccess({
  size = 'md',
  showIconBadge = true,
  className,
  ...props
}: InkStampSuccessProps) {
  const config = sizeConfig[size];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;

    const stamp = root.querySelector('.manga-stamp-seal');
    const checkmark = root.querySelector('.manga-check-path');

    let timeline: ReturnType<typeof createTimeline> | null = null;

    try {
      timeline = createTimeline({
        defaults: {
          ease: 'easeOutElastic(1.1, .6)',
        },
      });

      if (stamp) {
        timeline.add(stamp, {
          scale: [0.75, 1],
          rotate: [-8, 0],
          opacity: [0, 1],
          duration: 600,
        });
      }

      if (checkmark) {
        timeline.add(
          checkmark,
          {
            strokeDashoffset: [50, 0],
            opacity: [0, 1],
            duration: 450,
            ease: 'easeOutQuad',
          },
          180
        );
      }
    } catch {
      // Fallback to static SVG
    }

    return () => {
      try {
        timeline?.pause();
        timeline?.cancel();
      } catch {
        // noop cleanup
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('inline-flex flex-col items-center justify-center text-center', className)}
      {...props}
    >
      {/* Editorial Success Badge */}
      {showIconBadge && (
        <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1b221d] border border-[#2b4c34] text-emerald-400 text-[11px] font-medium tracking-wider">
          <CheckCircle2 size={config.iconSize} className="text-emerald-400" />
          <span className="text-[10px] uppercase tracking-[0.15em] text-emerald-300">
            Verificado
          </span>
        </div>
      )}

      <div className={cn('relative flex items-center justify-center', config.container)}>
        <svg
          width={config.svgWidth}
          height={config.svgHeight}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-[0_6px_20px_rgba(0,0,0,0.8)]"
        >
          <g className="manga-stamp-seal origin-center" style={{ transformOrigin: 'center' }}>
            {/* Outer Circular Seal Frame */}
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="#181a19"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="5 2.5"
            />

            {/* Inner concentric ring (Editorial Hanko / Stamp style) */}
            <circle
              cx="32"
              cy="32"
              r="23"
              stroke="#fbbf24"
              strokeWidth="1.2"
            />

            {/* Four cardinal registration corner pips */}
            <circle cx="32" cy="7" r="1.5" fill="#f59e0b" />
            <circle cx="32" cy="57" r="1.5" fill="#f59e0b" />
            <circle cx="7" cy="32" r="1.5" fill="#f59e0b" />
            <circle cx="57" cy="32" r="1.5" fill="#f59e0b" />

            {/* Handcrafted Calligraphic Checkmark */}
            <path
              className="manga-check-path"
              d="M20 33L28 41L45 22"
              stroke="#fbbf24"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="50"
              strokeDashoffset="0"
            />

            {/* Subtle decorative ink accent dots */}
            <circle cx="21" cy="22" r="1.2" fill="#d97706" />
            <circle cx="43" cy="42" r="1.2" fill="#d97706" />
          </g>
        </svg>
      </div>
    </div>
  );
}
