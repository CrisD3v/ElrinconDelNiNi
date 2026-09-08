import type { Meta, StoryObj } from '@storybook/react';
import { HeroBannerContent } from '../components/hero-banner-content';

const meta = {
  title: 'Features/Series/HeroBannerContent',
  component: HeroBannerContent,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-dark-900 p-8 rounded-xl max-w-2xl relative">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeroBannerContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    series: {
      id: 'manga-1',
      title: 'Solo Leveling',
      description: 'Ten years ago, "the Gate" appeared and connected the real world with the realm of magic and monsters. To combat these vile beasts, ordinary people received superhuman powers and became known as "Hunters".',
      coverArtUrl: 'https://example.com/cover.jpg',
      tags: ['Action', 'Fantasy', 'Adventure'],
      year: 2018,
      status: 'completed',
      contentRating: 'safe',
      availableLanguages: ['en', 'es'],
    },
  },
};
