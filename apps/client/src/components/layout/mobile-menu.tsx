'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X, Settings, LogOut } from 'lucide-react';
import { toast } from '@/lib/toast';
import { NavLinks } from './nav-links';
import { SearchButton } from './search-button';
import { LocaleSwitcher } from './locale-switcher';
import { AuthButton } from './auth-button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/auth-context';
import { ProfileSettingsModal } from './profile-settings-modal';

export function MobileMenu() {
  const t = useTranslations('nav');
  const tProfile = useTranslations('profile');
  const tAuth = useTranslations('auth');
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const displayName = profile?.displayName || user?.email?.split('@')[0] || tProfile('defaultUser');
  const email = profile?.email || user?.email || '';
  const avatarUrl = profile?.profileImage || null;

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
      toast.info({ title: tAuth('logoutSuccess') });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : tAuth('logoutError');
      toast.error({ title: tAuth('error'), description: message });
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-dark-700 transition-all duration-200 cursor-pointer"
        aria-label={t('menu')}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu panel */}
          <div className="absolute top-16 left-0 right-0 bg-dark-900/95 border-b border-dark-600/80 shadow-2xl backdrop-blur-xl z-50 animate-[slideDown_200ms_ease-out]">
            <div className="p-4 space-y-3">
              {/* Authenticated User Card */}
              {user && (
                <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-dark-700/80 shadow-md space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={avatarUrl}
                      name={displayName}
                      size="md"
                      className="ring-2 ring-accent/40"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-text-muted truncate">{email}</p>
                      <div className="mt-1">
                        <Badge variant="accent" className="text-[10px] py-0 px-2">
                          {tProfile('badgeReader')}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-dark-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSettingsOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-dark-800 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-dark-700 transition-colors cursor-pointer"
                    >
                      <Settings size={14} />
                      <span>{tProfile('settings')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-red-500/10 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>{tProfile('logout')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <NavLinks
                onNavigate={() => setIsOpen(false)}
                className="w-full justify-start py-2.5"
              />

              <div className="h-px bg-dark-700/60 my-2" />

              {/* Utility actions */}
              <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2">
                  <SearchButton />
                  <LocaleSwitcher />
                </div>
                {!user && <AuthButton />}
              </div>
            </div>
          </div>
        </>
      )}

      <ProfileSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
