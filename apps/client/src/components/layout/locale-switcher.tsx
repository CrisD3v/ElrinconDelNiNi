'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import type { Locale } from '@/i18n/routing';

const locales: { value: Locale; label: string }[] = [
  { value: 'es', label: 'ES' },
  { value: 'en', label: 'EN' },
];

export function LocaleSwitcher() {
  const t = useTranslations('locale');
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitch = (locale: Locale) => {
    router.replace(pathname, { locale });
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-1.5 px-3 py-2 rounded-xl
          text-sm text-text-secondary
          hover:text-text-primary hover:bg-dark-700
          transition-all duration-200 cursor-pointer
        "
        aria-label={t('label')}
      >
        <Globe size={16} />
        <span className="font-medium">{currentLocale.toUpperCase()}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-dark-800 border border-border rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50">
          {locales.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleSwitch(value)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-sm
                transition-colors duration-150 cursor-pointer
                ${
                  value === currentLocale
                    ? 'text-accent bg-accent/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-dark-700'
                }
              `}
            >
              <span className="font-medium">{label}</span>
              <span className="text-text-muted text-xs">{t(value)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
