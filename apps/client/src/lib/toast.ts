import { sileo, type SileoOptions, type SileoPosition } from 'sileo';

const DEFAULT_OPTIONS: Partial<SileoOptions> = {
  position: 'bottom-right' as SileoPosition,
  fill: '#2a2c2c',
};

export const toast = {
  success: (opts: SileoOptions) =>
    sileo.success({ ...DEFAULT_OPTIONS, ...opts, position: 'bottom-right' }),

  error: (opts: SileoOptions) =>
    sileo.error({ ...DEFAULT_OPTIONS, ...opts, position: 'bottom-right' }),

  info: (opts: SileoOptions) =>
    sileo.info({ ...DEFAULT_OPTIONS, ...opts, position: 'bottom-right' }),

  warning: (opts: SileoOptions) =>
    sileo.warning({ ...DEFAULT_OPTIONS, ...opts, position: 'bottom-right' }),

  show: (opts: SileoOptions) =>
    sileo.show({ ...DEFAULT_OPTIONS, ...opts, position: 'bottom-right' }),

  dismiss: (id: string) => sileo.dismiss(id),

  clear: () => sileo.clear('bottom-right'),
};
