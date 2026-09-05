'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Play, Compass } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { animate } from 'animejs';
import type { HeroBannerContentProps } from '../types';

export function HeroBannerContent({ series }: HeroBannerContentProps) {
  const t = useTranslations('home.hero');
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textContainerRef.current) return;

    const textAnim = animate(textContainerRef.current, {
      translateX: [-30, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutCubic',
    });

    return () => {
      textAnim.pause();
    };
  }, [series]);

  return (
    <div
      ref={textContainerRef}
      className="max-w-xl space-y-6 lg:space-y-8 order-2 lg:order-1 relative z-20 opacity-0"
    >
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {series.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="accent">
            {tag}
          </Badge>
        ))}
        {series.year && <Badge variant="default">{series.year}</Badge>}
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-text-primary drop-shadow-sm">
        {series.title}
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg text-text-secondary line-clamp-4 leading-relaxed">
        {series.description}
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-4 pt-4">
        <Link href={`/series/detail/${series.id}`}>
          <Button
            variant="primary"
            size="lg"
            className="h-12 px-8 text-base shadow-lg shadow-accent/20"
          >
            <Play size={20} className="mr-2" />
            {t('cta')}
          </Button>
        </Link>
        <Link href="/series/release">
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base bg-dark-900/50 hover:bg-dark-800"
          >
            <Compass size={20} className="mr-2" />
            {t('explore')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
