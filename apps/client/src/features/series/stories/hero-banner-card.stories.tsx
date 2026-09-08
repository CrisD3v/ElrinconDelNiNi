import type { Meta, StoryObj } from '@storybook/react';
import { HeroBannerCard } from '../components/hero-banner-card';

const meta = {
  title: 'Features/Series/HeroBannerCard',
  component: HeroBannerCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[500px] h-[700px] bg-dark-900 flex items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeroBannerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    series: {
      id: 'manga-1',
      title: 'Solo Leveling',
      description: 'Ten years ago, "the Gate" appeared and connected the real world with the realm of magic...',
      coverArtUrl: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=800&q=80',
      tags: ['Action', 'Fantasy'],
      year: 2018,
      status: 'completed',
      contentRating: 'safe',
      availableLanguages: ['en', 'es'],
    },
  },
};

export const NoImage: Story = {
  args: {
    series: {
      id: 'manga-2',
      title: 'Unknown Manga',
      description: 'This manga has no image yet.',
      coverArtUrl: undefined,
      tags: [],
      year: 2024,
      status: 'ongoing',
      contentRating: 'safe',
      availableLanguages: ['es'],
    },
  },
};
