'use client';

import { useRef, useCallback } from 'react';
import { animate } from 'animejs';

export function useParallaxTilt() {
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltContainerRef.current || !cardRef.current) return;

    const rect = tiltContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -((y - centerY) / centerY) * 15;
    const rotateY = ((x - centerX) / centerX) * 15;

    animate(cardRef.current, {
      rotateX,
      rotateY,
      duration: 400,
      easing: 'easeOutOut',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;

    animate(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 1000,
      easing: 'easeOutElastic(1, .5)',
    });
  }, []);

  return {
    cardRef,
    tiltContainerRef,
    handleMouseMove,
    handleMouseLeave,
  };
}
