import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>Lector</Badge>);
    expect(screen.getByText('Lector')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    render(<Badge variant="default">Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toHaveClass('bg-dark-700');
  });

  it('applies accent variant classes', () => {
    render(<Badge variant="accent">Accent</Badge>);
    const badge = screen.getByText('Accent');
    expect(badge).toHaveClass('text-accent');
  });

  it('applies muted variant classes', () => {
    render(<Badge variant="muted">Muted</Badge>);
    const badge = screen.getByText('Muted');
    expect(badge).toHaveClass('text-text-muted');
  });
});
