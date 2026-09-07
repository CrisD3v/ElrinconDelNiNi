import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navbar } from '@/components/layout/navbar';
import { AuthProvider } from '@/lib/auth/auth-context';
import { WebSocketProvider } from '@/providers/websocket-provider';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.some((l) => l === locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider locale={locale}>
      <AuthProvider>
        <WebSocketProvider>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
        </WebSocketProvider>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
