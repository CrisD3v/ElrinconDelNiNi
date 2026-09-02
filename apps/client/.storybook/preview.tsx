import type { Preview } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';
import '../src/app/globals.css';

// Mock messages for storybook
const messages = {
  home: {
    hero: {
      cta: 'Leer ahora',
      explore: 'Explorar',
    },
    sections: {
      releases: 'Nuevos Lanzamientos',
      top: 'Top Series',
      day: 'Series del Día',
      viewAll: 'Ver todo',
    },
  },
};

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="es" messages={messages}>
        <div className="bg-background min-h-screen text-text-primary p-4">
          <Story />
        </div>
      </NextIntlClientProvider>
    ),
  ],
};

export default preview;
