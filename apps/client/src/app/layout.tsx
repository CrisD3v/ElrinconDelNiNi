import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/lib/query/provider';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | El Rincón del NiNi',
    default: 'El Rincón del NiNi',
  },
  description: 'Tu portal de manga — Descubre, lee y sigue las mejores series.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-text-primary">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
