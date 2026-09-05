import type { Meta, StoryObj } from '@storybook/react';
import { SeriesCard } from '../series-card';
import type { SeriesDetail } from '@/lib/api/types';

const mockSeries: SeriesDetail = {
  id: 'solo-leveling',
  title: 'Solo Leveling (Arise)',
  description: 'Sung Jinwoo se convierte en el cazador más fuerte del mundo.',
  coverArtUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
  tags: ['Acción', 'Fantasía', 'Sobrenatural'],
  year: 2026,
  status: 'ongoing',
  contentRating: 'safe',
  availableLanguages: ['es', 'en'],
};

const meta = {
  title: 'Components/Series/SeriesCard',
  component: SeriesCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SeriesCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ongoing: Story = {
  args: {
    series: mockSeries,
  },
};

export const Completed: Story = {
  args: {
    series: {
      ...mockSeries,
      id: 'the-beginning-after-the-end',
      title: 'The Beginning After The End',
      status: 'completed',
    },
  },
};
