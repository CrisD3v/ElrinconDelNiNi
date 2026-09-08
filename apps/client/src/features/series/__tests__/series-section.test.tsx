import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SeriesSection } from '../components/series-section';

vi.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => {
    if (ns === 'home' && key === 'sections.latest') return 'Últimos Capítulos';
    if (ns === 'home' && key === 'viewAll') return 'Ver todo';
    if (ns === 'series' && key === 'error') return 'Error al cargar series';
    if (ns === 'series' && key === 'noResults') return 'No se encontraron series';
    return `${ns}.${key}`;
  },
}));

vi.mock('@/components/series/series-carousel', () => ({
  SeriesCarousel: ({ series }: any) => (
    <div data-testid="series-carousel">
      {series.map((s: any) => (
        <span key={s.id}>{s.title}</span>
      ))}
    </div>
  ),
}));

vi.mock('@/components/series/series-card-skeleton', () => ({
  SeriesCardSkeletonRow: () => <div data-testid="skeleton-row" />,
}));

describe('SeriesSection', () => {
  it('renders header with translated title and view all link', () => {
    render(<SeriesSection titleKey="latest" viewAllHref="/latest" series={[]} />);
    expect(screen.getByText('Últimos Capítulos')).toBeInTheDocument();
    expect(screen.getByText('Ver todo')).toBeInTheDocument();
  });

  it('renders skeleton row when isLoading is true', () => {
    render(<SeriesSection titleKey="latest" viewAllHref="/latest" series={[]} isLoading={true} />);
    expect(screen.getByTestId('skeleton-row')).toBeInTheDocument();
  });

  it('renders error message when error exists', () => {
    render(<SeriesSection titleKey="latest" viewAllHref="/latest" series={[]} error={new Error('test')} />);
    expect(screen.getByText('Error al cargar series')).toBeInTheDocument();
  });

  it('renders no results message when series is empty and not loading/error', () => {
    render(<SeriesSection titleKey="latest" viewAllHref="/latest" series={[]} />);
    expect(screen.getByText('No se encontraron series')).toBeInTheDocument();
  });

  it('renders carousel when series are provided', () => {
    const mockSeries = [{ id: '1', title: 'Manga 1' }, { id: '2', title: 'Manga 2' }];
    render(<SeriesSection titleKey="latest" viewAllHref="/latest" series={mockSeries as any} />);
    expect(screen.getByTestId('series-carousel')).toBeInTheDocument();
    expect(screen.getByText('Manga 1')).toBeInTheDocument();
    expect(screen.getByText('Manga 2')).toBeInTheDocument();
  });
});
