import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ReaderToolbar } from '../reader-toolbar';

const meta = {
  title: 'Components/Reader/ReaderToolbar',
  component: ReaderToolbar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReaderToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveReaderToolbar() {
  const [brightness, setBrightness] = useState(100);
  const [pageWidth, setPageWidth] = useState(840);
  const [quality, setQuality] = useState<'high' | 'dataSaver'>('high');

  return (
    <div className="p-8 bg-dark-950 flex flex-col items-center gap-4">
      <p className="text-xs text-text-muted">
        Brillo: {brightness}% | Ancho: {pageWidth}px | Calidad: {quality}
      </p>
      <ReaderToolbar
        brightness={brightness}
        pageWidth={pageWidth}
        quality={quality}
        onBrightnessChange={setBrightness}
        onPageWidthChange={setPageWidth}
        onQualityChange={setQuality}
      />
    </div>
  );
}

export const Default: Story = {
  args: {
    brightness: 100,
    pageWidth: 840,
    quality: 'high',
    onBrightnessChange: () => {},
    onPageWidthChange: () => {},
    onQualityChange: () => {},
  },
  render: () => <InteractiveReaderToolbar />,
};
