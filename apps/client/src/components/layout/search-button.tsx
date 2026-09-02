'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search, X } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';

export function SearchButton() {
  const t = useTranslations('nav');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/series/release?q=${encodeURIComponent(query.trim())}`);
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
    </form>
  );
}
