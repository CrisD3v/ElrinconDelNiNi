import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroBanner } from './hero-banner';
import type { SeriesDetail } from '@/lib/api/types';

const mockSeries = {
  id: '1',
  title: 'Test Series',
  description: 'This is a test description for the series.',
  coverArtUrl: 'https://example.com/cover.jpg',
  tags: ['Action', 'Adventure'],
  year: 2026,
};

describe('HeroBanner', () => {
  it('renders skeleton when no series is provided', () => {
    const { container } = render(<HeroBanner series={null} />);
    const pulseElement = container.querySelector('.animate-pulse');
    expect(pulseElement).toBeInTheDocument();
  });

  it('renders series data correctly', () => {
    render(<HeroBanner series={mockSeries as unknown as SeriesDetail} />);
    
    // Check title
    expect(screen.getByText('Test Series')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText('This is a test description for the series.')).toBeInTheDocument();
    
    // Check tags
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Adventure')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
    
    // Check CTAs
    expect(screen.getByText('cta')).toBeInTheDocument(); // Mocked translation
    expect(screen.getByText('explore')).toBeInTheDocument(); // Mocked translation
  });
});
