import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar } from '../avatar';

describe('Avatar', () => {
  it('renders image when src is provided', () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="User avatar" />);
    const img = screen.getByRole('img', { name: /user avatar/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders initials when name is provided and no src', () => {
    render(<Avatar name="Carlos Gomez" />);
    expect(screen.getByText('CG')).toBeInTheDocument();
  });

  it('renders two-letter initial for single word name', () => {
    render(<Avatar name="camilo" />);
    expect(screen.getByText('CA')).toBeInTheDocument();
  });

  it('renders fallback icon when no src or name', () => {
    const { container } = render(<Avatar />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
