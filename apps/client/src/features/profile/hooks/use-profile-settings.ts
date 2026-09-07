'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from '@/lib/toast';
import { useAuth } from '@/lib/auth/auth-context';

export interface UseProfileSettingsOptions {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function useProfileSettings({ isOpen, onClose, onSuccess }: UseProfileSettingsOptions) {
  const t = useTranslations('profile');
  const { profile, updateUserProfile } = useAuth();

  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');

  // Avatar states
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Banner states (Image or animated GIF)
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
  const [bannerRemoved, setBannerRemoved] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  // Synchronize initial state when modal opens or profile changes
  const [prevSyncKey, setPrevSyncKey] = useState<string | null>(null);
  const currentSyncKey =
    isOpen && profile
      ? `${isOpen}-${profile.id}-${profile.profileImage || ''}-${profile.bannerImage || ''}-${profile.displayName || ''}`
      : null;

  if (currentSyncKey !== prevSyncKey) {
    setPrevSyncKey(currentSyncKey);
    if (isOpen && profile) {
      setUsername(profile.username || '');
      setDescription(profile.description || '');
      setPreviewUrl(profile.profileImage || null);
      setBannerPreviewUrl(profile.bannerImage || null);
      setSelectedAvatarFile(null);
      setSelectedBannerFile(null);
      setBannerRemoved(false);
    }
  }

  // Handle avatar file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error({
        title: t('unsupportedFormatTitle'),
        description: t('unsupportedAvatarDesc'),
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error({
        title: t('fileTooLargeTitle'),
        description: t('avatarSizeLimitDesc'),
      });
      return;
    }

    setSelectedAvatarFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Handle banner file selection (Static image or animated GIF)
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error({
        title: t('unsupportedFormatTitle'),
        description: t('unsupportedBannerDesc'),
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error({
        title: t('fileTooLargeTitle'),
        description: t('bannerSizeLimitDesc'),
      });
      return;
    }

    setSelectedBannerFile(file);
    setBannerRemoved(false);
    const objectUrl = URL.createObjectURL(file);
    setBannerPreviewUrl(objectUrl);
  };

  // Reset or remove banner
  const handleRemoveBanner = () => {
    setSelectedBannerFile(null);
    setBannerPreviewUrl(null);
    setBannerRemoved(true);
    if (bannerInputRef.current) {
      bannerInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      if (username.trim()) {
        formData.append('username', username.trim().toLowerCase());
      }
      if (description.trim() !== undefined) {
        formData.append('description', description.trim());
      }
      if (selectedAvatarFile) {
        formData.append('profileImage', selectedAvatarFile);
      }
      if (selectedBannerFile) {
        formData.append('bannerImage', selectedBannerFile);
      } else if (bannerRemoved) {
        formData.append('removeBanner', 'true');
      }

      await updateUserProfile(formData);
      toast.success({
        title: t('updatedSuccess'),
        description: t('savedSuccessDesc'),
      });
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('retryLater');
      toast.error({
        title: t('updateErrorTitle'),
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    description,
    setDescription,
    previewUrl,
    selectedFile: selectedAvatarFile,
    bannerPreviewUrl,
    selectedBannerFile,
    bannerRemoved,
    loading,
    fileInputRef,
    bannerInputRef,
    handleFileChange,
    handleBannerChange,
    handleRemoveBanner,
    handleSubmit,
    profile,
    t,
  };
}
