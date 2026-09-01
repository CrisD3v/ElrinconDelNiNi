export type AppMode = 'api' | 'worker' | 'all';

export function getAppMode(): AppMode {
  const raw = process.env.APP_MODE?.toLowerCase();
  if (raw === 'api' || raw === 'worker' || raw === 'all') return raw;
  return 'all';
}

export function shouldRunWorkers(): boolean {
  const mode = getAppMode();
  return mode === 'worker' || mode === 'all';
}

export function shouldListenHttp(): boolean {
  const mode = getAppMode();
  return mode === 'api' || mode === 'all';
}
