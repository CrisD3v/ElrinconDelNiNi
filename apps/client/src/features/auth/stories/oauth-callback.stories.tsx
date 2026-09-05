import type { Meta, StoryObj } from '@storybook/react';
import { OAuthCallbackView } from '../components/oauth-callback-view';

const meta = {
  title: 'Features/Auth/OAuthCallback',
  component: OAuthCallbackView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OAuthCallbackView>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Estado principal de carga durante el handshake de Supabase OAuth (PKCE).
 * Muestra el contenedor sólido mate con MangaPageLoader artesanal (Anime.js).
 */
export const LoadingState: Story = {
  args: {
    status: 'loading',
  },
};

/**
 * Estado de error cuando la autenticación es cancelada o las credenciales son inválidas.
 */
export const ErrorState: Story = {
  args: {
    status: 'error',
    errorMessage: 'No se pudo verificar el código de autorización de Supabase. El enlace ha expirado.',
    onRetry: () => alert('Reintentando autenticación...'),
  },
};

/**
 * Estado de confirmación cuando el usuario ha sido autenticado con éxito.
 */
export const SuccessState: Story = {
  args: {
    status: 'success',
  },
};
