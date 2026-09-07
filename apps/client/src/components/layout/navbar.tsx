'use client';

import { Link } from '@/i18n/navigation';
import { NavLinks } from './nav-links';
import { SearchButton } from './search-button';
import { NotificationsBell } from './notifications-bell';
import { LocaleSwitcher } from './locale-switcher';
import { AuthButton } from './auth-button';
import { ProfileDropdown } from './profile-dropdown';
import { MobileMenu } from './mobile-menu';
import { useAuth } from '@/lib/auth/auth-context';

export function Navbar() {
  const { user, isLoading } = useAuth();

  return (
    <header className="glass fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
        >
          <span className="text-xl font-bold tracking-tight">
            <span className="text-accent">El Rincón</span>
            <span className="text-text-primary"> del NiNi</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-1">
          <NavLinks />
        </div>

        {/* Desktop right section */}
        <div className="flex items-center gap-1.5 sm:gap-4">
          <SearchButton />
          <NotificationsBell />
          <LocaleSwitcher />
          {!isLoading && user ? <ProfileDropdown /> : <AuthButton />}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
