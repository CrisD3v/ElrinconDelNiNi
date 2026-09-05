'use client';

import { useTranslations } from 'next-intl';
import { SlidersHorizontal, X } from 'lucide-react';
import { DrawerClose, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

import type { ImageQuality } from '@/hooks/use-reader-settings';

interface ReaderConfigPanelProps {
  brightness: number;
  pageWidth: number;
  quality: ImageQuality;
  onBrightnessChange: (value: number) => void;
  onPageWidthChange: (value: number) => void;
  onQualityChange: (value: ImageQuality) => void;
}

const BRIGHTNESS_OPTIONS = [10, 30, 50, 70, 100, 120, 140, 160, 180, 200];
const PAGE_WIDTH_OPTIONS = [600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140, 1200];

function OptionGrid({
  label,
  options,
  activeValue,
  onChange,
  formatLabel,
}: {
  label: string;
  options: number[];
  activeValue: number;
  onChange: (value: number) => void;
  formatLabel: (value: number) => string;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <h4 className="text-text-primary font-bold text-sm mb-3">{label}</h4>
      <div className="grid grid-cols-3 gap-2">
        {options.map((value) => {
          const isActive = value === activeValue;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              className={`
                px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? 'bg-accent text-dark-950 font-bold shadow-md shadow-accent/30 scale-[1.03]'
                    : 'bg-dark-800/40 text-text-secondary hover:text-text-primary hover:bg-dark-800'
                }
              `}
            >
              {formatLabel(value)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ReaderConfigPanel({
  brightness,
  pageWidth,
  quality,
  onBrightnessChange,
  onPageWidthChange,
  onQualityChange,
}: ReaderConfigPanelProps) {
  const t = useTranslations('reader');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <DrawerHeader className="p-5 border-b border-dark-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
            <SlidersHorizontal size={18} className="text-accent" />
          </div>
          <DrawerTitle className="text-base font-bold text-text-primary">
            {t('configTitle')}
          </DrawerTitle>
        </div>
        <DrawerClose asChild>
          <button
            type="button"
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-dark-800 transition-colors cursor-pointer"
            aria-label={t('close')}
          >
            <X size={18} />
          </button>
        </DrawerClose>
      </DrawerHeader>

      {/* Options Body */}
      <div className="p-6 overflow-y-auto flex-1 space-y-6">
        <OptionGrid
          label={t('brightness')}
          options={BRIGHTNESS_OPTIONS}
          activeValue={brightness}
          onChange={onBrightnessChange}
          formatLabel={(v) => `${v}%`}
        />

        <OptionGrid
          label={t('pageWidth')}
          options={PAGE_WIDTH_OPTIONS}
          activeValue={pageWidth}
          onChange={onPageWidthChange}
          formatLabel={(v) => `${v}px`}
        />

        {/* Calidad de Imagen */}
        <div>
          <h4 className="text-text-primary font-bold text-sm mb-3">{t('quality')}</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onQualityChange('high')}
              className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                quality === 'high'
                  ? 'bg-accent text-dark-950 font-bold shadow-md shadow-accent/30 scale-[1.02]'
                  : 'bg-dark-800/40 text-text-secondary hover:text-text-primary hover:bg-dark-800'
              }`}
            >
              {t('qualityHigh')}
            </button>
            <button
              type="button"
              onClick={() => onQualityChange('dataSaver')}
              className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                quality === 'dataSaver'
                  ? 'bg-accent text-dark-950 font-bold shadow-md shadow-accent/30 scale-[1.02]'
                  : 'bg-dark-800/40 text-text-secondary hover:text-text-primary hover:bg-dark-800'
              }`}
            >
              {t('qualityDataSaver')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
