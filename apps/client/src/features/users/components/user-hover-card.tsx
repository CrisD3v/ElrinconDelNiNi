'use client';

import * as HoverCard from '@radix-ui/react-hover-card';
import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';
import type { User } from '@elrincondelnini/types';

interface UserHoverCardProps {
  user: User;
  children: React.ReactNode;
}

export function UserHoverCard({ user, children }: UserHoverCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        if (cardRef.current) {
          animate(cardRef.current, {
            opacity: [0, 1],
            translateY: [10, 0],
            scale: [0.95, 1],
            ease: 'outElastic(1, .8)',
            duration: 500,
          });
        }
      });
    }
  }, [isOpen]);

  return (
    <HoverCard.Root open={isOpen} onOpenChange={setIsOpen} openDelay={300} closeDelay={200}>
      <HoverCard.Trigger asChild>
        {children}
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          ref={cardRef}
          side="top"
          align="start"
          sideOffset={8}
          className="z-50 w-72 rounded-xl border border-dark-600/60 bg-dark-800 shadow-2xl overflow-hidden opacity-0"
        >
          {/* Banner */}
          <div className="h-20 bg-dark-700 relative overflow-hidden">
            {user.bannerImage ? (
              <img
                src={user.bannerImage}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-gold-500/20 to-purple-500/20" />
            )}
          </div>

          {/* Profile Content */}
          <div className="p-4 pt-0 relative">
            <div className="w-16 h-16 rounded-full border-4 border-dark-800 bg-dark-700 -mt-8 relative overflow-hidden flex-shrink-0">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.username ? `@${user.username}` : 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-dark-600 text-gold-400 font-bold text-xl">
                  {(user.username || 'U')[0].toUpperCase()}
                </div>
              )}
            </div>

            <div className="mt-2">
              <h4 className="text-base font-bold text-text-primary leading-tight">
                {user.username ? `@${user.username}` : 'Usuario'}
              </h4>
              {user.description && (
                <p className="text-sm text-text-secondary mt-2 line-clamp-3">
                  {user.description}
                </p>
              )}
            </div>
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
