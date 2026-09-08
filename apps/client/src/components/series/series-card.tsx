'use client';

import { ImageWithLoader } from '@/components/ui/image-with-loader';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import type { SeriesDetail } from '@/lib/api/types';

interface SeriesCardProps {
  series: SeriesDetail;
}

export function SeriesCard({ series }: SeriesCardProps) {
  const tStatus = useTranslations('series.status');
  const displayTags = series.tags.slice(0, 2);

  const normalizedStatus = series.status?.toLowerCase() || '';
  const statusLabel =
    normalizedStatus === 'ongoing' || normalizedStatus === 'en emisión'
      ? tStatus('ongoing')
      : normalizedStatus === 'completed' || normalizedStatus === 'completado'
        ? tStatus('completed')
        : normalizedStatus === 'hiatus' || normalizedStatus === 'en pausa'
          ? tStatus('hiatus')
          : normalizedStatus === 'cancelled' || normalizedStatus === 'cancelado'
            ? tStatus('cancelled')
            : series.status;

  return (
    <Link
      href={`/series/detail/${series.id}`}
      className="
        group flex flex-col shrink-0
        w-[160px] sm:w-[180px] lg:w-[200px]
        scroll-snap-align-start
        transition-all duration-300 ease-out
      "
    >
      {/* Cover image */}
      <div className="
        relative aspect-[2/3] rounded-xl overflow-hidden
        bg-dark-800 border border-border
        transition-all duration-300
        group-hover:border-accent/50
        group-hover:glow-gold
        group-hover:scale-[1.04]
      ">
        {series.coverArtUrl ? (
          <ImageWithLoader
            src={series.coverArtUrl}
            alt={series.title}
            fill
            sizes="(max-width: 640px) 160px, (max-width: 1024px) 180px, 200px"
            wrapperClassName="w-full h-full"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dark-700">
            <span className="text-4xl opacity-30">📚</span>
          </div>
        )}

        {/* Overlay gradient on hover */}
        <div className="
          absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
        " />

        {/* Status badge */}
        {statusLabel && (
          <div className="absolute top-2 right-2">
            <Badge variant="accent" className="text-[10px]">
              {statusLabel}
            </Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-2.5 px-0.5 space-y-1.5">
        <h3 className="text-sm font-semibold text-text-primary line-clamp-2 leading-tight group-hover:text-accent transition-colors duration-200">
          {series.title}
        </h3>

        {/* Tags */}
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-text-muted bg-dark-800/80 px-1.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
