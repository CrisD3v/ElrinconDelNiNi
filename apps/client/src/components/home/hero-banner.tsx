'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Play, Compass } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SeriesDetail } from '@/lib/api/types';
import { animate } from 'animejs';

interface HeroBannerProps {
  series: SeriesDetail | null;
}

export function HeroBanner({ series }: HeroBannerProps) {
  const t = useTranslations('home.hero');
  const textContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!series || !textContainerRef.current) return;

    // We store the animation instance so we can pause/clean it up if needed, 
    // though for a simple intro animation it's usually fine.
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

  // 3D Parallax Tilt Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltContainerRef.current || !cardRef.current) return;
    
    const rect = tiltContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the container
    const y = e.clientY - rect.top;  // y position within the container

    // Calculate rotation (-15 to 15 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -((y - centerY) / centerY) * 15;
    const rotateY = ((x - centerX) / centerX) * 15;

    // Apply rotation smoothly with anime.js
    animate(cardRef.current, {
      rotateX,
      rotateY,
      duration: 400,
      easing: 'easeOutOut', // very fast responsive easing
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    // Return to original flat position
    animate(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 1000,
      easing: 'easeOutElastic(1, .5)', // bounce back smoothly
    });
  };

  if (!series) {
    return <HeroBannerSkeleton />;
  }

  return (
    <section className="relative w-full min-h-[600px] bg-transparent py-16 lg:py-24 overflow-visible">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[500px]">
          
          {/* Left: Text Content */}
          <div ref={textContainerRef} className="max-w-xl space-y-6 lg:space-y-8 order-2 lg:order-1 relative z-20 opacity-0">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {series.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="accent">
                  {tag}
                </Badge>
              ))}
              {series.year && (
                <Badge variant="default">{series.year}</Badge>
              )}
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
                <Button variant="primary" size="lg" className="h-12 px-8 text-base shadow-lg shadow-accent/20">
                  <Play size={20} className="mr-2" />
                  {t('cta')}
                </Button>
              </Link>
              <Link href="/series/release">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-dark-900/50 hover:bg-dark-800">
                  <Compass size={20} className="mr-2" />
                  {t('explore')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Floating Card Image with 3D Tilt */}
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
                  <Image
                    src={series.coverArtUrl}
                    alt={series.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-dark-800 flex items-center justify-center">
                    <span className="text-dark-600">No Image</span>
                  </div>
                )}
                
                {/* Glass reflection effect over the image */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" style={{ transform: 'translateZ(20px)' }} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function HeroBannerSkeleton() {
  return (
    <section className="relative w-full min-h-[600px] bg-background py-16 lg:py-24">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[500px] animate-pulse">
          
          <div className="max-w-xl space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-dark-700 rounded-full" />
              <div className="h-6 w-24 bg-dark-700 rounded-full" />
            </div>
            <div className="h-16 w-full lg:w-4/5 bg-dark-700 rounded-xl" />
            <div className="space-y-3">
              <div className="h-5 w-full bg-dark-700 rounded-md" />
              <div className="h-5 w-5/6 bg-dark-700 rounded-md" />
              <div className="h-5 w-4/6 bg-dark-700 rounded-md" />
            </div>
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-40 bg-dark-700 rounded-xl" />
              <div className="h-12 w-36 bg-dark-700 rounded-xl" />
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="w-full max-w-[320px] sm:max-w-[400px] aspect-[2/3] lg:aspect-[3/4] bg-dark-800 rounded-2xl" />
          </div>

        </div>
      </div>
    </section>
  );
}
