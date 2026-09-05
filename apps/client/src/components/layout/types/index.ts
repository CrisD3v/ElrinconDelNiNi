export interface NavbarProps {
  className?: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}
