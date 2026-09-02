import { notFound } from 'next/navigation';
import { getSeriesDetail, getSeriesChapters } from '@/lib/api/series';
import { SeriesSidebar } from '@/components/series/detail/series-sidebar';
import { ChapterList } from '@/components/series/detail/chapter-list';
import { SeasonSelector } from '@/components/series/detail/season-selector';

interface SeriesDetailPageProps {
  params: Promise<{ id: string, locale: string }>;
}

export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
  const { id, locale } = await params;

  try {
    // Peticiones concurrentes
    const [seriesRes, chaptersRes] = await Promise.all([
      getSeriesDetail(id),
      getSeriesChapters(id, { lang: locale, limit: 100 })
    ]);

    // La API retorna directamente el objeto SeriesDetail
    const series = seriesRes;
    if (!series || !series.id) {
      notFound();
    }

    const chapters = chaptersRes.chapters || [];

    return (
      <div className="w-full bg-dark-950 min-h-screen pt-24 pb-20">
        
        {/* Content Section */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            
            {/* Sidebar (Cover, Title, Info) */}
            <div className="w-full lg:w-[320px] shrink-0 sticky top-24">
              <SeriesSidebar series={series} />
            </div>

            {/* Main Content (Chapters) */}
            <div className="flex-1 w-full min-w-0">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Episodios</h2>
              
              <SeasonSelector 
                seasons={[]}
                activeSeasonId={''}
              />
              
              <div className="mt-8">
                <ChapterList chapters={chapters} seriesId={series.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to load series details:', error);
    notFound();
  }
}
