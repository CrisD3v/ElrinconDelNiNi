'use client';

import React, { useEffect, useRef } from 'react';
import { BookOpen, Feather } from 'lucide-react';
import { cn } from '@/lib/utils';
import { animate, stagger } from 'animejs';

export interface MangaPageLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  sublabel?: string;
  showFilament?: boolean;
  showIconBadge?: boolean;
}

const sizeConfig = {
  sm: {
    bookWidth: 'w-16 h-11', // 64px x 44px
    fontSize: 'text-xs',
    iconSize: 12,
  },
  md: {
    bookWidth: 'w-24 h-16', // 96px x 64px
    fontSize: 'text-sm',
    iconSize: 14,
  },
  lg: {
    bookWidth: 'w-32 h-20', // 128px x 80px
    fontSize: 'text-base',
    iconSize: 16,
  },
};

export function MangaPageLoader({
  size = 'md',
  label,
  sublabel,
  showFilament = true,
  showIconBadge = true,
  className,
  ...props
}: MangaPageLoaderProps) {
  const config = sizeConfig[size];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;
    const particles = root.querySelectorAll('.manga-js-particle');

    let anim: ReturnType<typeof animate> | null = null;
    try {
      if (particles.length > 0) {
        anim = animate(particles, {
          translateY: [
            { value: 0, duration: 0 },
            { value: -26, duration: 1600, ease: 'easeOutSine' },
          ],
          opacity: [
            { value: 0, duration: 0 },
            { value: 0.95, duration: 300 },
            { value: 0, duration: 1300 },
          ],
          scale: [
            { value: 0.5, duration: 0 },
            { value: 1.2, duration: 600 },
            { value: 0.2, duration: 1000 },
          ],
          delay: stagger(380),
          loop: true,
        });
      }
    } catch {
      // Fallback: CSS keyframes handle particle motion seamlessly
    }

    return () => {
      try {
        anim?.pause();
        anim?.cancel();
      } catch {
        // noop
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label={label || 'Cargando manuscrito'}
      className={cn('inline-flex flex-col items-center justify-center text-center select-none', className)}
      {...props}
    >
      {/* Editorial Badge Indicator */}
      {showIconBadge && (
        <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e2020] border border-[#3e4242] text-accent text-[11px] font-medium tracking-wider shadow-sm">
          <BookOpen size={config.iconSize} className="text-accent" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-semibold">
            Editorial
          </span>
          <Feather size={config.iconSize - 2} className="text-accent/80" />
        </div>
      )}

      {/* 3D Manga Book Flip Container */}
      <div
        className={cn(
          'relative flex items-center justify-center my-2',
          config.bookWidth
        )}
        style={{ perspective: '650px' }}
      >
        {/* Book Outer Leather Cover (Dark Graphite with Gold Corner Rivets) */}
        <div className="absolute inset-0 flex rounded-md overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.85)] border border-[#3e4242]">
          {/* Left Cover Backing */}
          <div className="w-1/2 h-full bg-[#121314] relative">
            <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-accent/40 rounded-tl-[1px]" />
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-accent/40 rounded-bl-[1px]" />
          </div>
          {/* Right Cover Backing */}
          <div className="w-1/2 h-full bg-[#121314] relative">
            <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-accent/40 rounded-tr-[1px]" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-accent/40 rounded-br-[1px]" />
          </div>
        </div>

        {/* Static Left Page (Reading Page with Manga Screentone Panels) */}
        <div className="absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-[#1a1b1c] rounded-l-sm border-l border-y border-[#353838] p-1.5 flex flex-col justify-between overflow-hidden shadow-inner z-10">
          <div className="space-y-1 opacity-60">
            <div className="h-1 bg-[#3a3d3d] rounded-full w-4/5" />
            <div className="h-1 bg-[#3a3d3d] rounded-full w-full" />
            <div className="h-1 bg-[#3a3d3d] rounded-full w-3/4" />
          </div>
          <div className="border border-[#323535] rounded-[2px] bg-[#161718] h-4 w-full flex items-center justify-center opacity-75">
            <div className="w-2 h-2 rounded-full border border-[#424646] opacity-40" />
          </div>
          <div className="space-y-1 opacity-50">
            <div className="h-0.5 bg-[#3a3d3d] rounded-full w-full" />
            <div className="h-0.5 bg-[#3a3d3d] rounded-full w-2/3" />
          </div>
        </div>

        {/* Static Right Page (Base Manuscript waiting to turn) */}
        <div className="absolute right-1 top-1 bottom-1 w-[calc(50%-4px)] bg-[#1a1b1c] rounded-r-sm border-r border-y border-[#353838] p-1.5 flex flex-col justify-between overflow-hidden shadow-inner z-10">
          <div className="border border-[#323535] rounded-[2px] bg-[#161718] h-5 w-full flex items-center justify-center opacity-75">
            <div className="w-4 h-1.5 bg-[#252828] rounded-[1px]" />
          </div>
          <div className="space-y-1 opacity-60">
            <div className="h-1 bg-[#3a3d3d] rounded-full w-full" />
            <div className="h-1 bg-[#3a3d3d] rounded-full w-4/5" />
            <div className="h-0.5 bg-[#3a3d3d] rounded-full w-2/3" />
          </div>
        </div>

        {/* 3D Dynamic Cascading Flipping Leaves (Right-to-Left Manga Turn) */}
        {/* Leaf 1: Primary Gold Leaf */}
        <div
          data-testid="manga-leaf-1"
          className="absolute left-1/2 top-1 bottom-1 w-[calc(50%-4px)] origin-left z-20 animate-[mangaPage3DTurn_1.8s_cubic-bezier(0.35,0.05,0.25,0.95)_infinite]"
          style={{
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            animationDelay: '0s',
          }}
        >
          {/* Front Face (Turns from right side, gold ink edge) */}
          <div
            className="absolute inset-0 bg-[#222425] rounded-r-sm border-r-2 border-y border-[#f59e0b] p-1 flex flex-col justify-between shadow-md"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="h-1 bg-[#f59e0b]/40 rounded-full w-3/4" />
            <div className="border border-[#f59e0b]/30 rounded-[1px] bg-[#1c1d1e] h-4 w-full" />
            <div className="h-0.5 bg-[#f59e0b]/30 rounded-full w-full" />
          </div>
          {/* Back Face (Lands on left side, inverted panel) */}
          <div
            className="absolute inset-0 bg-[#202122] rounded-l-sm border-l-2 border-y border-[#f59e0b] p-1 flex flex-col justify-between shadow-md"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="h-0.5 bg-[#f59e0b]/30 rounded-full w-full" />
            <div className="border border-[#f59e0b]/20 rounded-[1px] bg-[#1a1b1b] h-4 w-full" />
            <div className="h-1 bg-[#f59e0b]/40 rounded-full w-2/3" />
          </div>
        </div>

        {/* Leaf 2: Secondary Amber Leaf (Cascading at +0.6s) */}
        <div
          data-testid="manga-leaf-2"
          className="absolute left-1/2 top-1 bottom-1 w-[calc(50%-4px)] origin-left z-20 animate-[mangaPage3DTurn_1.8s_cubic-bezier(0.35,0.05,0.25,0.95)_infinite]"
          style={{
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            animationDelay: '0.6s',
          }}
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 bg-[#222425] rounded-r-sm border-r-2 border-y border-[#fbbf24] p-1 flex flex-col justify-between shadow-md"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="h-1 bg-[#fbbf24]/40 rounded-full w-4/5" />
            <div className="border border-[#fbbf24]/30 rounded-[1px] bg-[#1c1d1e] h-4 w-full" />
            <div className="h-0.5 bg-[#fbbf24]/30 rounded-full w-full" />
          </div>
          {/* Back Face */}
          <div
            className="absolute inset-0 bg-[#202122] rounded-l-sm border-l-2 border-y border-[#fbbf24] p-1 flex flex-col justify-between shadow-md"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="h-0.5 bg-[#fbbf24]/30 rounded-full w-full" />
            <div className="border border-[#fbbf24]/20 rounded-[1px] bg-[#1a1b1b] h-4 w-full" />
            <div className="h-1 bg-[#fbbf24]/40 rounded-full w-3/4" />
          </div>
        </div>

        {/* Leaf 3: Third Warm Ochre Leaf (Cascading at +1.2s) */}
        <div
          data-testid="manga-leaf-3"
          className="absolute left-1/2 top-1 bottom-1 w-[calc(50%-4px)] origin-left z-20 animate-[mangaPage3DTurn_1.8s_cubic-bezier(0.35,0.05,0.25,0.95)_infinite]"
          style={{
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            animationDelay: '1.2s',
          }}
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 bg-[#222425] rounded-r-sm border-r-2 border-y border-[#d97706] p-1 flex flex-col justify-between shadow-md"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="h-1 bg-[#d97706]/40 rounded-full w-3/4" />
            <div className="border border-[#d97706]/30 rounded-[1px] bg-[#1c1d1e] h-4 w-full" />
            <div className="h-0.5 bg-[#d97706]/30 rounded-full w-full" />
          </div>
          {/* Back Face */}
          <div
            className="absolute inset-0 bg-[#202122] rounded-l-sm border-l-2 border-y border-[#d97706] p-1 flex flex-col justify-between shadow-md"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="h-0.5 bg-[#d97706]/30 rounded-full w-full" />
            <div className="border border-[#d97706]/20 rounded-[1px] bg-[#1a1b1b] h-4 w-full" />
            <div className="h-1 bg-[#d97706]/40 rounded-full w-2/3" />
          </div>
        </div>

        {/* Central Book Spine (Binding with Gold Stitch Stitching) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1.5 -translate-x-1/2 bg-gradient-to-r from-[#b45309] via-[#f59e0b] to-[#b45309] rounded-sm z-30 shadow-md">
          {/* Top & Bottom Rivet caps */}
          <div className="w-2 h-1 bg-[#fcd34d] absolute -top-0.5 left-1/2 -translate-x-1/2 rounded-full shadow-sm" />
          <div className="w-2 h-1 bg-[#fcd34d] absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full shadow-sm" />
        </div>

        {/* Floating Gold Ink Particles over Spine */}
        <div className="absolute left-1/2 -top-2 -translate-x-1/2 pointer-events-none z-40 w-8 h-8 flex items-center justify-center">
          <span
            className="manga-js-particle absolute w-1.5 h-1.5 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] animate-[inkParticleDrift_2s_ease-out_infinite]"
            style={{ left: '2px', animationDelay: '0s' }}
          />
          <span
            className="manga-js-particle absolute w-1.5 h-1.5 rounded-full bg-[#fbbf24] shadow-[0_0_8px_#fbbf24] animate-[inkParticleDrift_2s_ease-out_infinite]"
            style={{ right: '2px', animationDelay: '0.6s' }}
          />
          <span
            className="manga-js-particle absolute w-1 h-1 rounded-full bg-[#fde68a] shadow-[0_0_6px_#fde68a] animate-[inkParticleDrift_2s_ease-out_infinite]"
            style={{ left: '12px', animationDelay: '1.2s' }}
          />
        </div>
      </div>

      {/* Narrative Label & Sublabel */}
      {label || sublabel ? (
        <div className="mt-3 space-y-1">
          {label && (
            <p className={cn('font-bold text-text-primary tracking-tight', config.fontSize)}>
              {label}
            </p>
          )}
          {sublabel && (
            <p className="text-xs text-text-secondary max-w-xs leading-relaxed font-normal">
              {sublabel}
            </p>
          )}
        </div>
      ) : null}

      {/* Filament Progress Indicator */}
      {showFilament && (
        <div className="w-28 h-1 bg-[#18191a] rounded-full overflow-hidden mt-3 relative border border-[#3e4242]">
          <div className="h-full bg-gradient-to-r from-transparent via-accent to-transparent rounded-full animate-[filamentSlide_1.6s_easeInOut_infinite]" />
        </div>
      )}
    </div>
  );
}
