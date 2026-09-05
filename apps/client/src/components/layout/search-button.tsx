'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search, X } from 'lucide-react';
import { useRouter, Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { useSearchSeries } from '@/hooks/use-series';

export function SearchButton() {
  const t = useTranslations('nav');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const locale = useLocale();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  const { data: searchResults, isLoading } = useSearchSeries(locale, debouncedQuery, 5);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/series/all?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-dark-700 transition-all duration-200 cursor-pointer"
        aria-label={t('search')}
      >
        <Search size={18} />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <div className="flex items-center bg-dark-800 border border-border rounded-xl overflow-hidden">
        <Search size={16} className="ml-3 text-text-muted shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search')}
          className="
            w-44 bg-transparent px-3 py-2 text-sm
            text-text-primary placeholder:text-text-muted
            outline-none
          "
        />
        <button
          type="button"
          onClick={handleClose}
          className="p-2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      {/* Dropdown for live search results */}
      {debouncedQuery.trim().length > 0 && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-dark-800 border border-border rounded-xl shadow-2xl overflow-hidden z-50">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-text-muted">
              {t('loading')}...
            </div>
          ) : searchResults?.series && searchResults.series.length > 0 ? (
            <div className="flex flex-col">
              {searchResults.series.map((series) => (
                <Link
                  key={series.id}
                  href={`/series/detail/${series.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-dark-700 transition-colors border-b border-dark-700/50 last:border-b-0"
                >
                  <div className="w-10 h-14 bg-dark-700 rounded overflow-hidden shrink-0">
                    {series.coverArtUrl ? (
                      <img src={series.coverArtUrl} alt={series.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-dark-600 to-dark-800" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{series.title}</p>
                    <p className="text-xs text-text-muted truncate mt-0.5">
                      {series.tags.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </Link>
              ))}
              <Link
                href={`/series/all?q=${encodeURIComponent(debouncedQuery.trim())}`}
                onClick={() => setIsOpen(false)}
                className="p-3 text-center text-sm text-accent hover:text-gold-400 hover:bg-dark-700 transition-colors bg-dark-800/50"
              >
                Ver todos los resultados
              </Link>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-text-muted">
              No se encontraron series.
            </div>
          )}
        </div>
      )}
    </form>
  );
}
