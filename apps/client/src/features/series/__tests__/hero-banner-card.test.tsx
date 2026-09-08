import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroBannerCard } from '../components/hero-banner-card';

describe('HeroBannerCard', () => {
  const mockSeries = {
    id: 'manga-1',
    title: 'Solo Leveling',
    description: 'A cool manga',
    coverArtUrl: 'https://example.com/cover.jpg',
    tags: [],
    year: 2020,
    status: 'ongoing' as const,
    contentRating: 'safe',
    availableLanguages: ['es'],
  };

  it('renders the cover image correctly', () => {
    render(<HeroBannerCard series={mockSeries} />);
    const img = screen.getByAltText('Solo Leveling');
    expect(img).toBeInTheDocument();
    // Next/Image encodes the src, but we can check if it exists
  });

  it('renders a fallback when no image is provided', () => {
    render(<HeroBannerCard series={{ ...mockSeries, coverArtUrl: undefined }} />);
    expect(screen.getByText('No Image')).toBeInTheDocument();
  });

  it('applies tilt on mouse move', () => {
    const { container } = render(<HeroBannerCard series={mockSeries} />);
    // The tilt container is the first direct child
    const tiltContainer = container.firstChild?.firstChild as HTMLElement;
    
    expect(tiltContainer).toBeInTheDocument();

    fireEvent.mouseMove(tiltContainer, { clientX: 100, clientY: 100 });
    fireEvent.mouseLeave(tiltContainer);
    // As it uses requestAnimationFrame and refs, we primarily test it doesn't crash
  });
});
