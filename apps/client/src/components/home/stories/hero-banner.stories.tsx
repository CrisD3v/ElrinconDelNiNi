import type { Meta, StoryObj } from '@storybook/react';
import { HeroBanner } from '@/features/series';
import type { SeriesDetail } from '@elrincondelnini/types';

const mockSeries: SeriesDetail = {
  id: '1',
  title: 'Solo Leveling (Arise)',
  description:
    'En un mundo donde cazadores con diversos poderes mágicos luchan contra monstruos mortales para proteger a la humanidad, Sung Jinwoo, el cazador más débil, se encuentra en una mazmorra doble que cambiará su destino para siempre.',
  coverArtUrl:
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
  tags: ['Acción', 'Fantasía', 'Sobrenatural'],
  year: 2026,
  status: 'ongoing',
  contentRating: 'safe',
  availableLanguages: ['es', 'en'],
};

const meta = {
  title: 'Home/HeroBanner',
  component: HeroBanner,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HeroBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    series: mockSeries,
  },
};

export const LoadingSkeleton: Story = {
  args: {
    series: null,
  },
};
