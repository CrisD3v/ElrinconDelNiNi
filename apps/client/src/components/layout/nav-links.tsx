'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Home, BookOpen, Heart } from 'lucide-react';

const links = [
  { href: '/' as const, labelKey: 'home', icon: Home },
  { href: '/series/all' as const, labelKey: 'series', icon: BookOpen },
  { href: '/favorites' as const, labelKey: 'favorites', icon: Heart },
];

interface NavLinksProps {
  onNavigate?: () => void;
  className?: string;
}

export function NavLinks({ onNavigate, className = '' }: NavLinksProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <>
      {links.map(({ href, labelKey, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/');
        const isHome = href === '/';
        const active = isHome ? pathname === '/' : isActive;

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl
              text-sm font-medium transition-all duration-200
              ${
                active
                  ? 'text-accent bg-accent/10'
                  : 'text-text-secondary hover:text-text-primary hover:bg-dark-700'
              }
              ${className}
            `}
          >
            <Icon size={16} />
            <span>{t(labelKey)}</span>
          </Link>
        );
      })}
    </>
  );
}
