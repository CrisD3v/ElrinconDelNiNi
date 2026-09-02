'use client';

import { useState, useEffect } from 'react';
import { SlidersHorizontal, Maximize2, Minimize2 } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { ReaderConfigPanel } from './reader-config-panel';

interface ReaderToolbarProps {
  brightness: number;
  pageWidth: number;
  onBrightnessChange: (value: number) => void;
  onPageWidthChange: (value: number) => void;
}

export function ReaderToolbar({
  brightness,
  pageWidth,
  onBrightnessChange,
  onPageWidthChange,
}: ReaderToolbarProps) {
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
              aria-label="Abrir configuración de lectura"
            >
              <SlidersHorizontal
                size={16}
                className="text-text-muted group-hover:text-accent transition-colors"
              />
              <span className="font-medium text-xs sm:text-sm">Configuración</span>
            </button>
          </DrawerTrigger>

          <DrawerContent direction="right">
            <ReaderConfigPanel
              brightness={brightness}
              pageWidth={pageWidth}
              onBrightnessChange={onBrightnessChange}
              onPageWidthChange={onPageWidthChange}
            />
          </DrawerContent>
        </Drawer>

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg text-text-secondary hover:text-accent hover:bg-dark-800/60 transition-all cursor-pointer"
          aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        >
          {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
        </button>
      </div>
    </div>
  );
}
