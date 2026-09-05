import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ReaderConfigPanel } from '../reader-config-panel';

const meta = {
  title: 'Components/Reader/ReaderConfigPanel',
  component: ReaderConfigPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReaderConfigPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveConfigPanel() {
  const [brightness, setBrightness] = useState(100);
  const [pageWidth, setPageWidth] = useState(840);
  const [quality, setQuality] = useState<'high' | 'dataSaver'>('high');

  return (
    <div className="w-[360px] p-6 bg-dark-900 border border-dark-700 rounded-2xl shadow-xl">
      <ReaderConfigPanel
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
  render: () => <InteractiveConfigPanel />,
};
