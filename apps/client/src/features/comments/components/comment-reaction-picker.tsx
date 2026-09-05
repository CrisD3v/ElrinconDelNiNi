'use client';

import { useState, useRef, useEffect } from 'react';

const EMOJIS = ['🔥', '❤️', '😂', '😮', '😢', '👏', '💯', '🤌', '⚡', '💀'];

interface CommentReactionPickerProps {
  reactions: { emoji: string; count: number; reactedByMe: boolean }[];
  onReact: (emoji: string) => void;
  disabled?: boolean;
}

export function CommentReactionPicker({
  reactions,
  onReact,
  disabled,
}: CommentReactionPickerProps) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={pickerRef}>
      {/* Existing reactions */}
      <div className="flex items-center flex-wrap gap-1">
        {reactions.map((r) => (
          <button
            key={r.emoji}
            onClick={() => !disabled && onReact(r.emoji)}
            disabled={disabled}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all ${
              r.reactedByMe
                ? 'bg-gold-500/20 border-gold-500/50 text-gold-300'
                : 'bg-dark-800/60 border-dark-600/50 text-text-secondary hover:border-gold-500/30 hover:text-text-primary'
            }`}
          >
            <span>{r.emoji}</span>
            <span className="font-medium">{r.count}</span>
          </button>
        ))}

        {/* Add reaction button */}
        <button
          onClick={() => !disabled && setOpen((o) => !o)}
          disabled={disabled}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-dark-600/50 bg-dark-800/40 text-text-muted hover:text-text-secondary hover:border-dark-500/60 transition-all"
          title="Añadir reacción"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 13s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>
          </svg>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
      </div>

      {/* Emoji picker dropdown */}
      {open && (
        <div className="absolute bottom-full mb-2 left-0 z-50 p-2 rounded-xl border border-dark-600/60 bg-dark-900/95 backdrop-blur-sm shadow-2xl">
          <div className="grid grid-cols-5 gap-1">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onReact(emoji);
                  setOpen(false);
                }}
                className="w-9 h-9 flex items-center justify-center text-xl rounded-lg hover:bg-dark-700/60 transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
