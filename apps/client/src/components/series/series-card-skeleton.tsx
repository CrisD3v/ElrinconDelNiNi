export function SeriesCardSkeleton() {
  return (
    <div className="flex flex-col shrink-0 w-[160px] sm:w-[180px] lg:w-[200px] animate-pulse">
      {/* Cover skeleton */}
      <div className="aspect-[2/3] rounded-xl bg-dark-700" />

      {/* Title skeleton */}
      <div className="mt-2.5 px-0.5 space-y-2">
        <div className="h-4 bg-dark-700 rounded-md w-4/5" />
        <div className="flex gap-1">
          <div className="h-4 bg-dark-700 rounded-full w-14" />
          <div className="h-4 bg-dark-700 rounded-full w-12" />
        </div>
      </div>
    </div>
  );
}

interface SkeletonRowProps {
  count?: number;
}

export function SeriesCardSkeletonRow({ count = 6 }: SkeletonRowProps) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <SeriesCardSkeleton key={i} />
      ))}
    </div>
  );
}
