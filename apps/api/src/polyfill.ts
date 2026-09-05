import { Temporal } from '@js-temporal/polyfill';

// Polyfill Temporal global for Prisma 8 pg/timestamptz-temporal@1 codec
if (typeof (globalThis as any).Temporal === 'undefined') {
  (globalThis as any).Temporal = Temporal;
}
