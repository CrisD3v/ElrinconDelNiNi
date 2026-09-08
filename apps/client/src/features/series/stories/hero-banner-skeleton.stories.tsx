import type { Meta, StoryObj } from '@storybook/react';
import { HeroBannerSkeleton } from '../components/hero-banner-skeleton';

const meta = {
  title: 'Features/Series/HeroBannerSkeleton',
  component: HeroBannerSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HeroBannerSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
