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
    <div
      onClick={() => setRevealed((prev) => !prev)}
      className="relative cursor-pointer group inline-block"
      title={revealed ? "Click para ocultar spoiler" : "Click para revelar spoiler"}
    >
      <div
        className={`transition-all duration-300 ease-out inline-block rounded-md ${
          revealed
            ? 'blur-none opacity-100'
            : 'blur-[6px] opacity-70 group-hover:blur-[4px] group-hover:opacity-90 bg-dark-600/30 text-transparent'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
