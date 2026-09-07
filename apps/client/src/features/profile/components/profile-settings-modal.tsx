'use client';

import React from 'react';
import { Camera, User, FileText, Loader2, UserPen, Trash2, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useProfileSettings } from '../hooks/use-profile-settings';
import type { ProfileSettingsModalProps } from '../types';

export function ProfileSettingsModal({
  isOpen,
  onClose,
  onSuccess,
}: ProfileSettingsModalProps) {
  const {
    username,
    setUsername,
    description,
    setDescription,
    previewUrl,
    bannerPreviewUrl,
    loading,
    fileInputRef,
    bannerInputRef,
    handleFileChange,
    handleBannerChange,
    handleRemoveBanner,
    handleSubmit,
    profile,
    t,
  } = useProfileSettings({ isOpen, onClose, onSuccess });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg border-[#3e4242] bg-[#18191a] p-0 overflow-hidden shadow-2xl shadow-black rounded-2xl animate-in fade-in-0 duration-200">
        {/* Decorative Manga Panel Corner Brackets */}
        <div
          aria-hidden="true"
          className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-accent/60 rounded-tl-[2px] pointer-events-none z-30"
        />
        <div
          aria-hidden="true"
          className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-accent/60 rounded-tr-[2px] pointer-events-none z-30"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-accent/60 rounded-bl-[2px] pointer-events-none z-30"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-accent/60 rounded-br-[2px] pointer-events-none z-30"
        />

        {/* Modal Header & Title */}
        <div className="pt-6 px-6 sm:px-8 text-center space-y-1.5 relative z-20">
          {/* Micro-badge capitular */}
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1f2121] border border-[#424646] text-accent text-[10px] font-bold tracking-[0.25em] uppercase shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>{t('volumeBadge')}</span>
          </div>

          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-bold tracking-tight text-text-primary flex items-center justify-center gap-2">
              <UserPen size={18} className="text-accent" />
              <span>{t('editTitle')}</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-text-secondary max-w-sm mx-auto">
              {t('editSubtitle')}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 sm:px-8 pb-6 sm:pb-8 mt-2">
          {/* Integrated Editorial Header: Panoramic Banner + Overlapped Avatar */}
          <div className="relative rounded-xl border border-[#353838] overflow-hidden bg-[#121314]">
            {/* Banner Area (Supports Static Image and Animated GIF) */}
            <div className="relative w-full h-28 sm:h-36 overflow-hidden bg-[#161718] group">
              {bannerPreviewUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={bannerPreviewUrl}
                  alt={t('bannerAlt')}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                /* Default Manga Screentone Texture & Frame */
                <div className="w-full h-full flex flex-col items-center justify-center relative bg-gradient-to-r from-[#181a1b] via-[#202224] to-[#181a1b] border-b border-[#2e3131]">
                  {/* Subtle screentone dots pattern */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(#f59e0b 0.75px, transparent 0.75px)',
                      backgroundSize: '12px 12px',
                    }}
                  />
                  <ImageIcon size={28} className="text-[#424646] mb-1" />
                  <span className="text-[11px] font-medium tracking-wider text-text-muted uppercase">
                    {t('noBannerAssigned')}
                  </span>
                </div>
              )}

              {/* Banner Action Buttons */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
                {bannerPreviewUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveBanner}
                    title={t('bannerRemove')}
                    aria-label={t('bannerRemove')}
                    className="p-1.5 rounded-full bg-black/70 hover:bg-black/90 text-red-400 border border-white/15 transition-colors cursor-pointer shadow-md"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 hover:bg-black/90 text-white text-[11px] font-medium tracking-wide border border-white/15 transition-colors shadow-md cursor-pointer"
                >
                  <Camera size={12} className="text-accent" />
                  <span>{t('bannerUpload')}</span>
                </button>
              </div>

              {/* Hidden Banner File Input */}
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/gif"
                onChange={handleBannerChange}
                className="hidden"
              />
            </div>

            {/* Overlapped Avatar Row */}
            <div className="px-4 pb-3 pt-0 flex items-end justify-between -mt-10 sm:-mt-12 relative z-20">
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer"
              >
                <Avatar
                  src={previewUrl}
                  name={username || profile?.username || profile?.email}
                  size="xl"
                  className="ring-4 ring-[#18191a] shadow-xl transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white ring-4 ring-[#18191a]">
                  <Camera size={20} className="text-accent" />
                  <span className="text-[9px] font-semibold tracking-tight mt-0.5">
                    {t('avatarUpload')}
                  </span>
                </div>
              </div>

              {/* Format Hint Badge */}
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-text-muted font-mono tracking-wide">
                  {t('bannerHint')}
                </span>
              </div>
            </div>

            {/* Hidden Avatar File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
              <span className="text-accent/80 font-bold">@</span>
              <span>Nombre de usuario</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s+/g, '').toLowerCase())}
              placeholder="usuario123"
              maxLength={30}
              className="
                w-full px-3.5 py-2.5 bg-[#121314] border border-[#3e4242] rounded-xl
                text-sm text-text-primary placeholder:text-text-muted
                focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
                transition-colors
              "
            />
            <p className="text-[10px] text-text-muted">Debe ser único y sin espacios.</p>
          </div>

          {/* Bio / Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
              <FileText size={13} className="text-accent/80" />
              <span>{t('bioLabel')}</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('bioPlaceholder')}
              className="
                w-full px-3.5 py-2.5 bg-[#121314] border border-[#3e4242] rounded-xl
                text-sm text-text-primary placeholder:text-text-muted resize-none
                focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
                transition-colors
              "
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              disabled={loading}
              onClick={onClose}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              size="md"
              disabled={loading}
              className="min-w-[130px] font-bold"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  <span>{t('saving')}</span>
                </>
              ) : (
                t('save')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
