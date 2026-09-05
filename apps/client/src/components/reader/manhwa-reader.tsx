'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useReaderSettings, type ImageQuality } from '@/hooks/use-reader-settings';
import { ReaderToolbar } from './reader-toolbar';
import { ChapterNavigation } from './chapter-navigation';
import { CommentSection } from '@/features/comments';

interface ChapterPageProps {
  index: number;
  totalImages: number;
  originalUrl: string;
  dataSaverUrl?: string;
  isInitialEager: boolean;
  preferredQuality: ImageQuality;
  chapterId: string;
  onLoaded: (index: number) => void;
}

function ChapterPage({
  index,
  totalImages,
  originalUrl,
  dataSaverUrl,
  isInitialEager,
  preferredQuality,
  chapterId,
  onLoaded,
}: ChapterPageProps) {
  const t = useTranslations('reader');

  const getInitialUrl = useCallback(() => {
    if (preferredQuality === 'dataSaver' && dataSaverUrl) {
      return dataSaverUrl;
    }
    return originalUrl;
  }, [preferredQuality, dataSaverUrl, originalUrl]);

  const initialUrl = getInitialUrl();
  const [prevInitialUrl, setPrevInitialUrl] = useState(initialUrl);
  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Sync if quality settings change
  if (prevInitialUrl !== initialUrl) {
    setPrevInitialUrl(initialUrl);
    setCurrentUrl(initialUrl);
    setIsLoaded(false);
    setIsFailed(false);
    setRetryCount(0);
  }

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    setIsFailed(false);
    onLoaded(index);
  }, [index, onLoaded]);

  const handleImageError = useCallback(() => {
    // 1. If currently using originalUrl and data-saver is available, switch to data-saver
    if (currentUrl === originalUrl && dataSaverUrl) {
      setCurrentUrl(dataSaverUrl);
      return;
    }

    // 2. If data-saver also encountered an error (or no data-saver), auto-retry up to 2 times with a slight delay
    if (retryCount < 2) {
      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        const targetBase = dataSaverUrl || originalUrl;
        setCurrentUrl(`${targetBase}?retry=${Date.now()}`);
      }, 750 * (retryCount + 1));
      return () => clearTimeout(timer);
    }

    // 3. Mark as failed after all automatic recovery attempts have exhausted
    setIsFailed(true);
    onLoaded(index); // Mark loaded in progress bar so reader doesn't hang
  }, [currentUrl, originalUrl, dataSaverUrl, retryCount, index, onLoaded]);

  const handleManualRetry = () => {
    setIsFailed(false);
    setIsLoaded(false);
    setRetryCount((prev) => prev + 1);
    const targetBase = dataSaverUrl || originalUrl;
    setCurrentUrl(`${targetBase}?retry=${Date.now()}`);
  };

  return (
    <div
      key={`${chapterId}-page-${index}`}
      className="relative w-full bg-dark-950 overflow-hidden min-h-[350px]"
    >
      {/* Skeleton shimmer visible until loaded */}
      {!isLoaded && !isFailed && (
        <div
          className="w-full skeleton-shimmer flex items-center justify-center"
          style={{ aspectRatio: '2/3', minHeight: '350px' }}
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
              {t('imageError', { number: index + 1 })}
            </p>
            <button
              type="button"
              onClick={handleManualRetry}
              className="px-4 py-2 rounded-lg bg-accent/20 border border-accent/40 text-accent text-xs font-bold hover:bg-accent hover:text-dark-950 transition-colors cursor-pointer shadow-sm"
            >
              {t('retryImage')}
            </button>
          </div>
        </div>
      )}

      {/* Actual image */}
      {!isFailed && (
        <img
          key={currentUrl}
          src={currentUrl}
          alt={t('pageNumber', { number: index + 1 })}
          loading={isInitialEager ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          ref={(img) => {
            if (img && img.complete && img.naturalWidth > 0 && !isLoaded) {
              handleImageLoad();
            }
          }}
          className={`w-full block transition-opacity duration-300 ease-out ${
            isLoaded
              ? 'opacity-100 relative'
              : 'opacity-0 absolute inset-0 pointer-events-none'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
}

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
  const {
    brightness,
    pageWidth,
    quality,
    isHydrated,
    setBrightness,
    setPageWidth,
    setQuality,
  } = useReaderSettings();

  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isFinishedLoading, setIsFinishedLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

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

  const [prevIsAllLoaded, setPrevIsAllLoaded] = useState(isAllLoaded);
  if (prevIsAllLoaded !== isAllLoaded) {
    setPrevIsAllLoaded(isAllLoaded);
    if (!isAllLoaded) {
      setIsFinishedLoading(false);
    }
  }

  // Keep progress bar at 100% briefly before fading out smoothly
  useEffect(() => {
    if (isAllLoaded) {
      const timer = setTimeout(() => {
        setIsFinishedLoading(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isAllLoaded]);

  // Use defaults during SSR/hydration
  const activeBrightness = isHydrated ? brightness : 100;
  const activePageWidth = isHydrated ? pageWidth : 600;
  const activeQuality = isHydrated ? quality : 'high';

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
        quality={activeQuality}
        onBrightnessChange={setBrightness}
        onPageWidthChange={setPageWidth}
        onQualityChange={setQuality}
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
        {pages.map((url, index) => (
          <ChapterPage
            key={`${chapterId}-page-${index}`}
            index={index}
            totalImages={totalImages}
            originalUrl={url}
            dataSaverUrl={pagesDataSaver[index]}
            isInitialEager={index < 2}
            preferredQuality={activeQuality}
            chapterId={chapterId}
            onLoaded={handleImageLoad}
          />
        ))}
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

      {/* Comments Toggle Button */}
      <button
        id="reader-comments-btn"
        onClick={() => setShowComments(true)}
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-dark-900/90 border border-dark-600/60 text-text-secondary hover:text-text-primary hover:border-gold-500/40 shadow-xl backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
        title="Ver comentarios"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span className="text-xs font-medium">Comentarios</span>
      </button>

      {/* Comments Slide-up Panel */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 flex flex-col transition-transform duration-400 ease-in-out ${
          showComments ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '80vh' }}
      >
        {/* Overlay */}
        {showComments && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"
            onClick={() => setShowComments(false)}
          />
        )}

        <div className="flex flex-col bg-dark-900/98 border-t border-dark-600/60 rounded-t-2xl shadow-2xl" style={{ maxHeight: '80vh' }}>
          {/* Panel handle / header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-dark-700/50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 rounded-full bg-dark-600 mx-auto absolute left-1/2 -translate-x-1/2 top-3" />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gold-400" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span className="font-semibold text-sm text-text-primary">Comentarios del capítulo</span>
            </div>
            <button
              onClick={() => setShowComments(false)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-text-primary hover:bg-dark-700/50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Comments content */}
          <div className="flex-1 overflow-hidden">
            {showComments && (
              <CommentSection chapterId={chapterId} compact />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
