import { SeriesCard } from './series-card';
import type { SeriesDetail } from '@/lib/api/types';

interface SeriesGridProps {
  series: SeriesDetail[];
}

export function SeriesGrid({ series }: SeriesGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {series.map((item) => (
        <SeriesCard key={item.id} series={item} />
      ))}
    </div>
  );
}
