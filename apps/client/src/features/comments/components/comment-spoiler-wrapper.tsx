'use client';

import { useState } from 'react';

interface CommentSpoilerWrapperProps {
  children: React.ReactNode;
  isSpoiler: boolean;
}

export function CommentSpoilerWrapper({ children, isSpoiler }: CommentSpoilerWrapperProps) {
  const [revealed, setRevealed] = useState(false);

  if (!isSpoiler) return <>{children}</>;

  return (
    <div className="relative">
      <div
        className={`transition-all duration-300 ${
          revealed ? 'blur-none' : 'blur-sm select-none pointer-events-none'
        }`}
      >
        {children}
      </div>
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 group"
          aria-label="Revelar spoiler"
        >
          <span className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-400 group-hover:bg-gold-500/30 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            SPOILER — click para revelar
          </span>
        </button>
      )}
      {revealed && (
        <button
          onClick={() => setRevealed(false)}
          className="mt-1 text-xs text-text-secondary hover:text-gold-400 transition-colors"
        >
          Ocultar spoiler
        </button>
      )}
    </div>
  );
}
