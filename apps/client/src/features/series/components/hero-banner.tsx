'use client';

import React from 'react';
import { HeroBannerContent } from './hero-banner-content';
import { HeroBannerCard } from './hero-banner-card';
import { HeroBannerSkeleton } from './hero-banner-skeleton';
import type { HeroBannerProps } from '../types';

export function HeroBannerRoot({ series, className = '' }: HeroBannerProps) {
  if (!series) {
    return <HeroBannerSkeleton />;
  }

  return (
    <section className={`relative w-full min-h-[600px] bg-transparent py-16 lg:py-24 overflow-visible ${className}`}>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[500px]">
          <HeroBannerContent series={series} />
          <HeroBannerCard series={series} />
        </div>
      </div>
    </section>
  );
}

export const HeroBanner = Object.assign(HeroBannerRoot, {
  Content: HeroBannerContent,
  Card: HeroBannerCard,
  Skeleton: HeroBannerSkeleton,
});
