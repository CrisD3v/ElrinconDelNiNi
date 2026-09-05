'use client';

import * as React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
};

const iconSizes = {
  sm: 14,
  md: 18,
  lg: 24,
  xl: 32,
};

function getInitials(name?: string | null): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className,
  ...props
}: AvatarProps) {
  const [prevSrc, setPrevSrc] = React.useState(src);
  const [imageError, setImageError] = React.useState(false);

  if (prevSrc !== src) {
    setPrevSrc(src);
    setImageError(false);
  }

  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-accent/30 bg-gradient-to-br from-dark-800 via-dark-900 to-dark-950 font-semibold text-accent shadow-sm select-none',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : initials ? (
        <span className="tracking-wider text-accent drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {initials}
        </span>
      ) : (
        <User size={iconSizes[size]} className="text-accent/80" />
      )}
    </div>
  );
}
