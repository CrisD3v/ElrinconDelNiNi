'use client';

import { useLocale } from 'next-intl';
import { HeroBanner } from '@/components/home/hero-banner';
import { SeriesSection } from '@/components/home/series-section';
import {
  useReleaseSeries,
  useTopSeries,
  useDaySeries,
} from '@/hooks/use-series';

export default function HomePage() {
  const locale = useLocale();

  const releases = useReleaseSeries(locale);
  const top = useTopSeries(locale);
  const day = useDaySeries(locale);

  // Use the first release series as the hero
  const heroSeries = releases.data?.series?.[0] ?? null;

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Top right glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3 z-0" />
      
      {/* Bottom left glow (at the end of the page) */}
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px] pointer-events-none translate-y-1/3 -translate-x-1/4 z-0" />

      <div className="space-y-12 pb-16 relative z-10">
        {/* Hero Banner */}
        <HeroBanner series={heroSeries} />

        {/* Series Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <SeriesSection
            titleKey="releases"
            viewAllHref="/series/release"
            series={releases.data?.series ?? []}
            isLoading={releases.isLoading}
            error={releases.error}
          />

          <SeriesSection
            titleKey="top"
            viewAllHref="/series/top"
            series={top.data?.series ?? []}
            isLoading={top.isLoading}
            error={top.error}
          />

          <SeriesSection
            titleKey="day"
            viewAllHref="/series/day"
            series={day.data?.series ?? []}
            isLoading={day.isLoading}
            error={day.error}
          />
        </div>
      </div>
    </div>
  );
}
