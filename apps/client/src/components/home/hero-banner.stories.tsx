import type { Meta, StoryObj } from '@storybook/react';
import { HeroBanner } from './hero-banner';
import type { SeriesDetail } from '@/lib/api/types';

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

const mockSeries = {
  id: '1',
  title: 'Solo Leveling',
  description:
    'Hace una década, apareció una puerta que conecta este mundo con un mundo paralelo, y algunos humanos despertaron poderes especiales para cazar a los monstruos en su interior. Son conocidos como "Cazadores". Sin embargo, no todos son poderosos. Sung Jin-Woo, un cazador de Rango E, tiene que arriesgar su vida en la mazmorra más baja.',
  coverArtUrl: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
  tags: ['Action', 'Fantasy', 'Adventure'],
  year: 2024,
};

export const Default: Story = {
  args: {
    series: mockSeries as unknown as SeriesDetail,
  },
};

export const Skeleton: Story = {
  args: {
    series: null,
  },
};
