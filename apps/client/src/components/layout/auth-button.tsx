'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthModal } from './auth-modal';

export function AuthButton() {
  const t = useTranslations('nav');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
      >
        <User size={16} />
        <span className="hidden lg:inline">{t('login')}</span>
      </Button>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
