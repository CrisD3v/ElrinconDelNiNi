import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AuthModal } from '../components/auth-modal';
import { Button } from '@/components/ui/button';
import { AuthProvider } from '@/lib/auth/auth-context';

const meta = {
  title: 'Features/Auth/AuthModal',
  component: AuthModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AuthProvider>
        <Story />
      </AuthProvider>
    ),
  ],
} satisfies Meta<typeof AuthModal>;

export default meta;
type Story = StoryObj<typeof meta>;

function LoginModeStory() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Abrir Modal (Login)</Button>
      <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} defaultTab="login" />
    </>
  );
}

function RegisterModeStory() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Abrir Modal (Registro)</Button>
      <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} defaultTab="register" />
    </>
  );
}

export const LoginMode: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    defaultTab: 'login',
  },
  render: () => <LoginModeStory />,
};

export const RegisterMode: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    defaultTab: 'register',
  },
  render: () => <RegisterModeStory />,
};

export const CompoundCustomComposition: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
  render: () => (
    <AuthModal.Root isOpen={true} onClose={() => {}}>
      <AuthModal.Tabs />
      <AuthModal.LoginForm />
      <AuthModal.OAuthButtons />
    </AuthModal.Root>
  ),
};

export const RenderPropsUsage: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
  render: () => (
    <AuthModal.Root isOpen={true} onClose={() => {}}>
      {({ activeTab, setTab, reset }) => (
        <div className="space-y-4 p-4 text-center">
          <p className="text-sm font-semibold text-accent">Pestaña actual: {activeTab}</p>
          <div className="flex gap-2 justify-center">
            <Button size="sm" onClick={() => setTab('login')}>Login</Button>
            <Button size="sm" variant="outline" onClick={() => setTab('register')}>Register</Button>
            <Button size="sm" variant="secondary" onClick={reset}>Reset</Button>
          </div>
        </div>
      )}
    </AuthModal.Root>
  ),
};
