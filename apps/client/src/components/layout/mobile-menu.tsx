'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { NavLinks } from './nav-links';
import { SearchButton } from './search-button';
import { LocaleSwitcher } from './locale-switcher';
import { AuthButton } from './auth-button';

export function MobileMenu() {
  const t = useTranslations('nav');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-dark-700 transition-all duration-200 cursor-pointer"
        aria-label={t('menu')}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu panel */}
          <div className="absolute top-16 left-0 right-0 bg-dark-900 border-b border-border shadow-2xl z-50 animate-[slideDown_200ms_ease-out]">
            <div className="p-4 space-y-2">
              <NavLinks
                onNavigate={() => setIsOpen(false)}
                className="w-full justify-start"
              />

              <div className="h-px bg-border my-3" />

              <div className="flex items-center justify-between gap-2 px-2">
                <SearchButton />
                <LocaleSwitcher />
                <AuthButton />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
