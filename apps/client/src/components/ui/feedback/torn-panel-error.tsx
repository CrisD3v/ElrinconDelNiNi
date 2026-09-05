'use client';

import React, { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { animate, createTimeline, stagger } from 'animejs';

export interface TornPanelErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  showIconBadge?: boolean;
  badgeLabel?: string;
}

const sizeConfig = {
  sm: {
    container: 'w-12 h-12',
    svgWidth: 48,
    svgHeight: 48,
    iconSize: 12,
  },
  md: {
    container: 'w-20 h-20',
    svgWidth: 76,
    svgHeight: 76,
    iconSize: 14,
  },
  lg: {
    container: 'w-28 h-28',
    svgWidth: 96,
    svgHeight: 96,
    iconSize: 16,
  },
};

export function TornPanelError({
  size = 'md',
  showIconBadge = true,
  badgeLabel = 'Anomalía',
  className,
  ...props
}: TornPanelErrorProps) {
  const config = sizeConfig[size];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;

    const panel = root.querySelector('.manga-panel-box');
    const crack = root.querySelector('.manga-crack-path');
    const droplets = root.querySelectorAll('.manga-ink-droplet');
    const exclamation = root.querySelector('.manga-exclamation');

    let timeline: ReturnType<typeof createTimeline> | null = null;
    let dropletAnim: ReturnType<typeof animate> | null = null;

    try {
      timeline = createTimeline({
        defaults: {
          ease: 'easeOutElastic(1, .6)',
        },
      });

      // 1. Initial elastic impact
      if (panel) {
        timeline.add(panel, {
          scale: [0.88, 1],
          rotate: [-3, 0],
          duration: 700,
        });
      }

      // 2. SVG crack drawing in real-time
      if (crack) {
        timeline.add(
          crack,
          {
            strokeDashoffset: [60, 0],
            opacity: [0, 1],
            duration: 650,
            ease: 'easeOutQuad',
          },
          200
        );
      }

      // 3. Manga exclamation mark pop
      if (exclamation) {
        timeline.add(
          exclamation,
          {
            scale: [0.5, 1.15, 1],
            opacity: [0, 1],
            duration: 500,
            ease: 'easeOutBack',
          },
          350
        );
      }

      // 4. Crimson ink droplets drifting / pulsing
      if (droplets.length > 0) {
        dropletAnim = animate(droplets, {
          translateY: [
            { value: 0, duration: 0 },
            { value: 6, duration: 1200, ease: 'easeInOutSine' },
            { value: 0, duration: 1200, ease: 'easeInOutSine' },
          ],
          opacity: [
            { value: 0.6, duration: 0 },
            { value: 1, duration: 1200 },
            { value: 0.6, duration: 1200 },
          ],
          scale: [
            { value: 0.9, duration: 0 },
            { value: 1.25, duration: 1200 },
            { value: 0.9, duration: 1200 },
          ],
          delay: stagger(200),
          loop: true,
        });
      }
    } catch {
      // Fallback to static SVG if animation is interrupted
    }

    return () => {
      try {
        timeline?.pause();
        timeline?.cancel();
        dropletAnim?.pause();
        dropletAnim?.cancel();
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
      {/* Editorial Warning Badge */}
      {showIconBadge && (
        <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#241717] border border-[#5c2828] text-red-400 text-[11px] font-medium tracking-wider">
          <AlertTriangle size={config.iconSize} className="text-red-400" />
          <span className="text-[10px] uppercase tracking-[0.15em] text-red-300">
            {badgeLabel}
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
          className="relative z-10 drop-shadow-[0_6px_20px_rgba(0,0,0,0.85)]"
        >
          {/* Background Comic Panel with Torn Top-Right Corner */}
          <g className="manga-panel-box origin-center" style={{ transformOrigin: 'center' }}>
            <path
              d="M8 12C8 9.79086 9.79086 8 12 8H44L56 20V52C56 54.2091 54.2091 56 52 56H12C9.79086 56 8 54.2091 8 52V12Z"
              fill="#181919"
              stroke="#4a4f4f"
              strokeWidth="1.6"
            />

            {/* Torn corner fold */}
            <path
              d="M44 8V18C44 19.1046 44.8954 20 46 20H56"
              fill="#222424"
              stroke="#ef4444"
              strokeWidth="1.2"
              strokeOpacity="0.8"
            />

            {/* Comic Screentone / Halftone subtle dot matrix */}
            <circle cx="16" cy="18" r="1" fill="#3a3d3d" />
            <circle cx="22" cy="18" r="1" fill="#3a3d3d" />
            <circle cx="28" cy="18" r="1" fill="#3a3d3d" />
            <circle cx="16" cy="24" r="1" fill="#3a3d3d" />
            <circle cx="22" cy="24" r="1" fill="#3a3d3d" />
            <circle cx="28" cy="24" r="1" fill="#3a3d3d" />
            <circle cx="16" cy="30" r="1" fill="#3a3d3d" />
            <circle cx="22" cy="30" r="1" fill="#3a3d3d" />

            {/* Torn/Fractured diagonal ink slash path */}
            <path
              className="manga-crack-path"
              d="M18 46L46 18"
              stroke="#ef4444"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeDasharray="60"
              strokeDashoffset="0"
            />

            {/* Distressed ink splash droplets */}
            <circle className="manga-ink-droplet" cx="22" cy="40" r="1.8" fill="#f87171" />
            <circle className="manga-ink-droplet" cx="43" cy="24" r="1.4" fill="#ef4444" />
            <circle className="manga-ink-droplet" cx="49" cy="31" r="2.2" fill="#b91c1c" />

            {/* Manga stylized exclamation mark */}
            <g className="manga-exclamation origin-center" style={{ transformOrigin: '32px 33px' }}>
              <path
                d="M32 23V35"
                stroke="#fca5a5"
                strokeWidth="3.6"
                strokeLinecap="round"
              />
              <circle cx="32" cy="42" r="2.2" fill="#fca5a5" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
