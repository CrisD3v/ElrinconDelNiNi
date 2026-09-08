'use client';

import { useState } from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';

interface ImageWithLoaderProps extends NextImageProps {
  wrapperClassName?: string;
  skeletonClassName?: string;
}

export function ImageWithLoader({
  src,
  alt,
  className,
  wrapperClassName,
  skeletonClassName,
  ...props
}: ImageWithLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn('relative overflow-hidden', wrapperClassName)}>
      {!isLoaded && !hasError && (
        <Skeleton className={cn('absolute inset-0 z-0', skeletonClassName)} />
      )}
      <NextImage
        src={hasError ? '/placeholder-image.png' : src} // You can define a placeholder path if needed
        alt={alt}
        className={cn(
          'transition-opacity duration-500 ease-in-out',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsLoaded(true);
          setHasError(true);
        }}
        {...props}
      />
    </div>
  );
}
