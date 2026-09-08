import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { UserHoverCard } from '../components/user-hover-card';
import type { User } from '@elrincondelnini/types';

describe('UserHoverCard', () => {
  const mockUser: User = {
    id: 'user-1',
    username: 'ninja_master',
    displayName: 'Ninja Master',
    profileImage: 'https://example.com/profile.jpg',
    bannerImage: 'https://example.com/banner.jpg',
    description: 'Anime lover and manga reader.',
    badges: ['PRO'],
    email: 'ninja@example.com',
    supabaseId: 'supa-1',
  };

  it('renders trigger element correctly', () => {
    render(
      <UserHoverCard user={mockUser}>
        <button>Hover Me</button>
      </UserHoverCard>
    );

    expect(screen.getByRole('button', { name: 'Hover Me' })).toBeInTheDocument();
  });

  it('displays user details when hovered', async () => {
    const user = userEvent.setup();
    render(
      <UserHoverCard user={mockUser}>
        <button>Hover Me</button>
      </UserHoverCard>
    );

    const trigger = screen.getByRole('button', { name: 'Hover Me' });
    
    // Hover triggers the popover
    await user.hover(trigger);

    // Wait for the hover card to open
    await waitFor(() => {
      expect(screen.getByText('@ninja_master')).toBeInTheDocument();
    });

    expect(screen.getByText('Anime lover and manga reader.')).toBeInTheDocument();
    
    // Images
    const profileImg = screen.getByAltText('@ninja_master');
    expect(profileImg).toBeInTheDocument();
    expect(profileImg).toHaveAttribute('src', 'https://example.com/profile.jpg');
    
    const bannerImg = screen.getByAltText('Banner');
    expect(bannerImg).toBeInTheDocument();
    expect(bannerImg).toHaveAttribute('src', 'https://example.com/banner.jpg');
  });

  it('displays fallback initials when profile image is missing', async () => {
    const user = userEvent.setup();
    const minimalUser: User = {
      ...mockUser,
      profileImage: null,
      username: 'testguy',
    };

    render(
      <UserHoverCard user={minimalUser}>
        <button>Hover Me</button>
      </UserHoverCard>
    );

    await user.hover(screen.getByRole('button', { name: 'Hover Me' }));

    await waitFor(() => {
      expect(screen.getByText('@testguy')).toBeInTheDocument();
    });

    // The first letter of 'testguy' uppercase is 'T'
    expect(screen.getByText('T')).toBeInTheDocument();
    
    // Banner should not be rendered as image
    expect(screen.queryByAltText('Banner')).not.toBeInTheDocument();
  });
});
