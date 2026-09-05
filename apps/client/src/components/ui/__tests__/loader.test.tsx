import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loader } from '../loader';

describe('Loader', () => {
  it('renders spinner variant by default', () => {
    const { container } = render(<Loader />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders pulse variant', () => {
    const { container } = render(<Loader variant="pulse" />);
    const pulse = container.querySelector('.animate-ping');
    expect(pulse).toBeInTheDocument();
  });

  it('renders dots variant', () => {
    const { container } = render(<Loader variant="dots" />);
    const dots = container.querySelectorAll('.animate-bounce');
    expect(dots.length).toBe(3);
  });

  it('renders optional label', () => {
    render(<Loader label="Cargando perfil..." />);
    expect(screen.getAllByText('Cargando perfil...').length).toBeGreaterThanOrEqual(1);
  });
});
