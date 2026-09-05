import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getSeriesDetail, getSeriesChapters } from '@/lib/api/series';
import { SeriesSidebar } from '@/components/series/detail/series-sidebar';
import { SeriesContentTabs } from '@/components/series/detail/series-content-tabs';

import { Chapter, SeriesDetail } from '@/lib/api/types';

interface SeriesDetailPageProps {
  params: Promise<{ id: string, locale: string }>;
}

export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
  const { id, locale } = await params;
  const t = await getTranslations('detail');

  let series: SeriesDetail | undefined;
  let chapters: Chapter[] = [];

  try {
    // Peticiones concurrentes con el locale solicitado
    const [seriesRes, chaptersRes] = await Promise.all([
      getSeriesDetail(id, locale),
      getSeriesChapters(id, { lang: locale, limit: 100 })
    ]);

    series = seriesRes;
    chapters = chaptersRes?.chapters || [];
  } catch (error) {
    console.error('Failed to load series details:', error);
    notFound();
  }

  if (!series || !series.id || chapters.length === 0) {
    notFound();
  }

  return (
    <div className="w-full bg-dark-950 min-h-screen pt-24 pb-20">
      
      {/* Content Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Sidebar (Cover, Title, Info) */}
          <div className="w-full lg:w-[320px] shrink-0 sticky top-24">
            <SeriesSidebar series={series} />
          </div>

          {/* Main Content — tabs: Episodios / Comentarios */}
          <SeriesContentTabs
            chapters={chapters}
            seriesId={series.id}
          />
        </div>
      </div>
    </div>
  );
}
