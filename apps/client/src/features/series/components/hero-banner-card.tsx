'use client';

import React from 'react';
import { ImageWithLoader } from '@/components/ui/image-with-loader';
import { useParallaxTilt } from '../hooks/use-parallax-tilt';
import type { HeroBannerCardProps } from '../types';

export function HeroBannerCard({ series }: HeroBannerCardProps) {
  const { cardRef, tiltContainerRef, handleMouseMove, handleMouseLeave } = useParallaxTilt();

  return (
    <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
      <div
        className="relative w-full max-w-[320px] sm:max-w-[400px] aspect-[2/3] lg:aspect-[3/4] animate-float"
        style={{ perspective: '1000px' }}
        ref={tiltContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={cardRef}
          className="w-full h-full rounded-2xl overflow-hidden glow-gold border border-accent/20 shadow-2xl relative transition-transform duration-75"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {series.coverArtUrl ? (
            <ImageWithLoader
              src={series.coverArtUrl}
              alt={series.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 500px"
              wrapperClassName="w-full h-full"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-dark-800 flex items-center justify-center">
              <span className="text-dark-600">No Image</span>
            </div>
          )}

          {/* Glass reflection effect over the image */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"
            style={{ transform: 'translateZ(20px)' }}
          />
        </div>
      </div>
    </div>
  );
}
