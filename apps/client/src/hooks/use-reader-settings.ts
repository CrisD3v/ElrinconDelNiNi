'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';

export type ImageQuality = 'high' | 'dataSaver';

interface ReaderSettings {
  brightness: number;
  pageWidth: number;
  quality: ImageQuality;
}

const STORAGE_KEY = 'ernn-reader-settings';

const DEFAULT_SETTINGS: ReaderSettings = {
  brightness: 100,
  pageWidth: 600,
  quality: 'high',
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
    window.dispatchEvent(new Event('reader-settings-changed'));
  } catch {
    // Ignore storage errors
  }
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('reader-settings-changed', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('reader-settings-changed', callback);
  };
}

let cachedSettingsString = '';
let cachedSettings: ReaderSettings = DEFAULT_SETTINGS;

function getSnapshot(): ReaderSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY) || '';
    if (stored !== cachedSettingsString) {
      cachedSettingsString = stored;
      cachedSettings = stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    }
  } catch {
    return DEFAULT_SETTINGS;
  }
  return cachedSettings;
}

export function useReaderSettings() {
  const syncedSettings = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => DEFAULT_SETTINGS
  );

  const [localSettings, setLocalSettings] = useState<ReaderSettings | null>(null);
  const settings = localSettings ?? syncedSettings;

  const setBrightness = useCallback((brightness: number) => {
    setLocalSettings((prev) => {
      const current = prev ?? loadSettings();
      const next = { ...current, brightness };
      saveSettings(next);
      return next;
    });
  }, []);

  const setPageWidth = useCallback((pageWidth: number) => {
    setLocalSettings((prev) => {
      const current = prev ?? loadSettings();
      const next = { ...current, pageWidth };
      saveSettings(next);
      return next;
    });
  }, []);

  const setQuality = useCallback((quality: ImageQuality) => {
    setLocalSettings((prev) => {
      const current = prev ?? loadSettings();
      const next = { ...current, quality };
      saveSettings(next);
      return next;
    });
  }, []);

  return {
    ...settings,
    isHydrated: true,
    setBrightness,
    setPageWidth,
    setQuality,
  };
}
