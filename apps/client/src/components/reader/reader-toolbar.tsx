'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { SlidersHorizontal, Maximize2, Minimize2 } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { ReaderConfigPanel } from './reader-config-panel';

import type { ImageQuality } from '@/hooks/use-reader-settings';

interface ReaderToolbarProps {
  brightness: number;
  pageWidth: number;
  quality: ImageQuality;
  onBrightnessChange: (value: number) => void;
  onPageWidthChange: (value: number) => void;
  onQualityChange: (value: ImageQuality) => void;
}

export function ReaderToolbar({
  brightness,
  pageWidth,
  quality,
  onBrightnessChange,
  onPageWidthChange,
  onQualityChange,
}: ReaderToolbarProps) {
  const t = useTranslations('reader');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen not supported or denied
    }
  };

  // Sync fullscreen state when user exits via Escape key
  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  return (
    <div className="w-full px-3 sm:px-4 mt-4 sm:mt-6 mb-4">
      {/* Centered Card with exact same width as manhwa images */}
      <div
        className="mx-auto bg-dark-900/90 backdrop-blur-md border border-dark-700/80 hover:border-gold-600/30 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-lg transition-[max-width] duration-300 ease-out"
        style={{ maxWidth: `${pageWidth}px` }}
      >
        {/* Shadcn Drawer opening from the RIGHT */}
        <Drawer direction="right" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors group cursor-pointer"
              aria-label={t('configTitle')}
            >
              <SlidersHorizontal
                size={16}
                className="text-text-muted group-hover:text-accent transition-colors"
              />
              <span className="font-medium text-xs sm:text-sm">{t('config')}</span>
            </button>
          </DrawerTrigger>

          <DrawerContent direction="right">
            <ReaderConfigPanel
              brightness={brightness}
              pageWidth={pageWidth}
              quality={quality}
              onBrightnessChange={onBrightnessChange}
              onPageWidthChange={onPageWidthChange}
              onQualityChange={onQualityChange}
            />
          </DrawerContent>
        </Drawer>

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg text-text-secondary hover:text-accent hover:bg-dark-800/60 transition-all cursor-pointer"
          aria-label={isFullscreen ? t('exitFullscreen') : t('fullscreen')}
        >
          {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
        </button>
      </div>
    </div>
  );
}
