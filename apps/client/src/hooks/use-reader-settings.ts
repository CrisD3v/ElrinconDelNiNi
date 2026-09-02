'use client';

import { useState, useEffect, useCallback } from 'react';

interface ReaderSettings {
  brightness: number;
  pageWidth: number;
}

const STORAGE_KEY = 'ernn-reader-settings';

const DEFAULT_SETTINGS: ReaderSettings = {
  brightness: 100,
  pageWidth: 600,
};

function loadSettings(): ReaderSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: ReaderSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
}

export function useReaderSettings() {
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setIsHydrated(true);
  }, []);

  const setBrightness = useCallback((brightness: number) => {
    setSettings((prev) => {
      const next = { ...prev, brightness };
      saveSettings(next);
      return next;
    });
  }, []);

  const setPageWidth = useCallback((pageWidth: number) => {
    setSettings((prev) => {
      const next = { ...prev, pageWidth };
      saveSettings(next);
      return next;
    });
  }, []);

  return {
    ...settings,
    isHydrated,
    setBrightness,
    setPageWidth,
  };
}
