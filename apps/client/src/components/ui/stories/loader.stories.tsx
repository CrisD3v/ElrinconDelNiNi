import type { Meta, StoryObj } from '@storybook/react';
import { Loader } from '../loader';

const meta = {
  title: 'UI/Loader',
  component: Loader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['spinner', 'pulse', 'dots'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    label: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spinner: Story = {
  args: {
    variant: 'spinner',
    size: 'md',
    label: 'Cargando...',
  },
};

export const Pulse: Story = {
  args: {
    variant: 'pulse',
    size: 'md',
    label: 'Procesando...',
  },
};

export const Dots: Story = {
  args: {
    variant: 'dots',
    size: 'md',
    label: 'Espere un momento...',
  },
};

export const Small: Story = {
  args: {
    variant: 'spinner',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    variant: 'spinner',
    size: 'lg',
    label: 'Sincronizando biblioteca...',
  },
};
