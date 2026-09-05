import type { UserMe } from '@elrincondelnini/types';

export interface ProfileDropdownProps {
  className?: string;
  onOpenSettings?: () => void;
}

export interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: UserMe | null;
  onSuccess?: () => void;
}
