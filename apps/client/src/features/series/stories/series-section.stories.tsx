import type { Meta, StoryObj } from '@storybook/react';
import { SeriesSection } from '../components/series-section';
import type { SeriesDetail } from '../types';

const mockSeriesList: SeriesDetail[] = [
  {
    id: '1',
    title: 'Solo Leveling',
    description: 'El cazador más débil alcanza el pináculo.',
    coverArtUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    tags: ['Acción', 'Fantasía'],
    year: 2026,
    status: 'ongoing',
    contentRating: 'safe',
    availableLanguages: ['es'],
  },
  {
    id: '2',
    title: 'Omniscient Reader',
    description: 'El único que conoce el final de la novela.',
    coverArtUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    tags: ['Aventura', 'Misterio'],
    year: 2025,
    status: 'ongoing',
    contentRating: 'safe',
    availableLanguages: ['es', 'en'],
  },
  {
    id: '3',
    title: 'Tower of God',
    description: '¿Qué deseas? Dinero, gloria, poder, o algo que supera todo eso.',
    coverArtUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    tags: ['Fantasía', 'Drama'],
    year: 2024,
    status: 'completed',
    contentRating: 'safe',
    availableLanguages: ['es'],
  },
];

const meta = {
  title: 'Features/Series/SeriesSection',
  component: SeriesSection,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SeriesSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Releases: Story = {
  args: {
    titleKey: 'releases',
    viewAllHref: '/series?sort=latest',
    series: mockSeriesList,
    isLoading: false,
  },
};

export const LoadingState: Story = {
  args: {
    titleKey: 'top',
    viewAllHref: '/series?sort=top',
    series: [],
    isLoading: true,
  },
};

export const EmptyState: Story = {
  args: {
    titleKey: 'day',
    viewAllHref: '/series?sort=day',
    series: [],
    isLoading: false,
  },
};
