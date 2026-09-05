import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'accent', 'muted'],
    },
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Accent: Story = {
  args: {
    variant: 'accent',
    children: 'Lector',
  },
};

export const Default: Story = {
  args: {
    variant: 'default',
    children: 'En emisión',
  },
};

export const Muted: Story = {
  args: {
    variant: 'muted',
    children: 'Completado',
  },
};

export const AllVariants: Story = {
  args: {
    children: 'Badge',
  },
  render: () => (
    <div className="flex items-center gap-3">
      <Badge variant="accent">Accent (Gold)</Badge>
      <Badge variant="default">Default</Badge>
      <Badge variant="muted">Muted</Badge>
    </div>
  ),
};
