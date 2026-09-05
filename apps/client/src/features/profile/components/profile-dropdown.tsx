'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Settings, Heart, LogOut, ChevronDown } from 'lucide-react';
import { toast } from '@/lib/toast';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/auth-context';
import { ProfileSettingsModal } from './profile-settings-modal';
import type { ProfileDropdownProps } from '../types';

export function ProfileDropdown({ className = '', onOpenSettings }: ProfileDropdownProps) {
  const tAuth = useTranslations('auth');
  const tProfile = useTranslations('profile');
  const router = useRouter();
  const { profile, user, signOut } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const displayName = profile?.displayName || user?.email?.split('@')[0] || tProfile('defaultUser');
  const email = profile?.email || user?.email || '';
  const avatarUrl = profile?.profileImage || null;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.info({
        title: tAuth('logoutSuccess'),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : tAuth('logoutError');
      toast.error({
        title: tAuth('error'),
        description: message,
      });
    }
  };

  const handleOpenSettings = () => {
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      setIsSettingsOpen(true);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`
              flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full
              border border-dark-600/70 hover:border-accent/50 bg-dark-900/60 hover:bg-dark-800
              transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/40
              group ${className}
            `}
          >
            <Avatar
              src={avatarUrl}
              name={displayName}
              size="sm"
              className="ring-1 ring-accent/30 group-hover:ring-accent/60 transition-all"
            />
            <span className="hidden lg:inline text-xs font-semibold text-text-primary max-w-[120px] truncate">
              {displayName}
            </span>
            <ChevronDown
              size={14}
              className="text-text-muted group-hover:text-text-primary transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-2">
          {/* User Details Header */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-dark-950/70 border border-dark-700/60 mb-1">
            <Avatar
              src={avatarUrl}
              name={displayName}
              size="md"
              className="ring-2 ring-accent/40"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-text-primary truncate">
                  {displayName}
                </p>
              </div>
              <p className="text-xs text-text-muted truncate mt-0.5">{email}</p>
              <div className="mt-1.5">
                <Badge variant="accent" className="text-[10px] py-0 px-2">
                  {tProfile('badgeReader')}
                </Badge>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Actions */}
          <DropdownMenuItem onClick={handleOpenSettings} className="py-2.5">
            <Settings size={16} className="text-text-secondary" />
            <span>{tProfile('settings')}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push('/favorites')}
            className="py-2.5"
          >
            <Heart size={16} className="text-text-secondary" />
            <span>{tProfile('favorites')}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Sign out */}
          <DropdownMenuItem
            variant="danger"
            onClick={handleSignOut}
            className="py-2.5 text-red-400 hover:text-red-300"
          >
            <LogOut size={16} />
            <span>{tProfile('logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
      />
    </>
  );
}
