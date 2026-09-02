'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useReaderSettings } from '@/hooks/use-reader-settings';
import { ReaderToolbar } from './reader-toolbar';
import { ChapterNavigation } from './chapter-navigation';

interface ManhwaReaderProps {
  pages: string[];
  pagesDataSaver?: string[];
  seriesId: string;
  chapterId: string;
  prevChapterId: string | null;
  nextChapterId: string | null;
  currentChapterNumber: string | null;
}

export function ManhwaReader({
  pages,
  pagesDataSaver = [],
  seriesId,
  chapterId,
  prevChapterId,
  nextChapterId,
  currentChapterNumber,
}: ManhwaReaderProps) {
  const { brightness, pageWidth, isHydrated, setBrightness, setPageWidth } =
    useReaderSettings();
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [useFallback, setUseFallback] = useState<Set<number>>(new Set());
  const [isFinishedLoading, setIsFinishedLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const totalImages = pages.length;
  const loadedCount = loadedImages.size;
  const progressPercent =
    totalImages > 0 ? Math.min(100, Math.round((loadedCount / totalImages) * 100)) : 0;
  const isAllLoaded = totalImages > 0 && loadedCount >= totalImages;

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  const handleImageError = useCallback(
    (index: number) => {
      // If we haven't tried data-saver fallback yet and it exists, try fallback
      if (!useFallback.has(index) && pagesDataSaver[index]) {
        setUseFallback((prev) => new Set(prev).add(index));
        return;
      }

      setFailedImages((prev) => new Set(prev).add(index));
      // Mark as loaded so progress bar doesn't hang indefinitely
      setLoadedImages((prev) => new Set(prev).add(index));
    },
    [pagesDataSaver, useFallback]
  );

  // Check cached images on mount and on reload
  useEffect(() => {
    if (!containerRef.current) return;
    const imgElements = containerRef.current.querySelectorAll('img');
    imgElements.forEach((img, index) => {
      if (img.complete && img.naturalWidth > 0) {
        handleImageLoad(index);
      }
    });
  }, [pages, handleImageLoad]);

  // Keep progress bar at 100% briefly before fading out smoothly
  useEffect(() => {
    if (isAllLoaded) {
      const timer = setTimeout(() => {
        setIsFinishedLoading(true);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setIsFinishedLoading(false);
    }
  }, [isAllLoaded]);

  // Use defaults during SSR/hydration
  const activeBrightness = isHydrated ? brightness : 100;
  const activePageWidth = isHydrated ? pageWidth : 600;

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {/* Progress Bar (Positioned directly under the fixed 64px header) */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 h-1 bg-dark-900/60 transition-opacity duration-500 ${
          isFinishedLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div
          className="h-full bg-gradient-to-r from-accent via-gold-400 to-accent transition-[width] duration-300 ease-out reader-progress-bar shadow-[0_0_12px_rgba(245,158,11,0.6)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Centered Toolbar with same max-width as images */}
      <ReaderToolbar
        brightness={activeBrightness}
        pageWidth={activePageWidth}
        onBrightnessChange={setBrightness}
        onPageWidthChange={setPageWidth}
      />

      {/* Images Container */}
      <div
        ref={containerRef}
        className="mx-auto w-full transition-[max-width] duration-300 ease-out flex-1 px-2 sm:px-0"
        style={{
          maxWidth: `${activePageWidth}px`,
          filter: `brightness(${activeBrightness / 100})`,
        }}
      >
        {pages.map((url, index) => {
          const isLoaded = loadedImages.has(index);
          const isFailed = failedImages.has(index);
          const imageUrl =
            useFallback.has(index) && pagesDataSaver[index] ? pagesDataSaver[index] : url;

          return (
            <div
              key={`${chapterId}-page-${index}`}
              className="relative w-full bg-dark-950 overflow-hidden"
            >
              {/* Skeleton shimmer (visible until image loads) */}
              {!isLoaded && (
                <div
                  className="w-full skeleton-shimmer flex items-center justify-center"
                  style={{ aspectRatio: '2/3', minHeight: '300px' }}
                >
                  <span className="text-text-muted text-xs font-semibold tracking-wider">
                    {index + 1} / {totalImages}
                  </span>
                </div>
              )}

              {/* Failed state with retry button */}
              {isFailed && (
                <div className="w-full flex items-center justify-center bg-dark-900/60 border border-dark-800 py-16 px-4 my-2 rounded-xl">
                  <div className="text-center">
                    <p className="text-text-muted text-sm mb-3">
                      Error al cargar la imagen {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFailedImages((prev) => {
                          const next = new Set(prev);
                          next.delete(index);
                          return next;
                        });
                        setLoadedImages((prev) => {
                          const next = new Set(prev);
                          next.delete(index);
                          return next;
                        });
                        setUseFallback((prev) => {
                          const next = new Set(prev);
                          next.delete(index);
                          return next;
                        });
                      }}
                      className="px-4 py-2 rounded-lg bg-accent/20 border border-accent/40 text-accent text-xs font-bold hover:bg-accent hover:text-dark-950 transition-colors cursor-pointer"
                    >
                      Reintentar imagen
                    </button>
                  </div>
                </div>
              )}

              {/* Actual image */}
              {!isFailed && (
                <img
                  src={imageUrl}
                  alt={`Página ${index + 1}`}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  ref={(img) => {
                    // Check if already completed by browser cache
                    if (img && img.complete && img.naturalWidth > 0 && !isLoaded) {
                      handleImageLoad(index);
                    }
                  }}
                  className={`w-full block transition-opacity duration-300 ease-out ${
                    isLoaded
                      ? 'opacity-100 relative'
                      : 'opacity-0 absolute inset-0 pointer-events-none'
                  }`}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Spacing between last image and navigation section */}
      <div className="h-16 sm:h-24 w-full" />

      {/* Chapter Navigation */}
      <ChapterNavigation
        seriesId={seriesId}
        prevChapterId={prevChapterId}
        nextChapterId={nextChapterId}
        currentChapterNumber={currentChapterNumber}
      />
    </div>
  );
}
