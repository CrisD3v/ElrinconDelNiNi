import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NextImageMock({ src, alt, width, height, className, ...props }: any) {
  const resolvedSrc = typeof src === 'string' ? src : src?.src || '';
  const { priority: _p, fill: _f, ...rest } = props;
  void _p;
  void _f;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={alt || ''}
      width={width}
      height={height}
      className={className}
      {...rest}
    />
  );
}
