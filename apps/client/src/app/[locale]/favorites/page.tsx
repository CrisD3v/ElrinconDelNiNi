'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { apiGet } from '@/lib/api/client';
import { useAuth } from '@/lib/auth/auth-context';
import { SeriesCard } from '@/components/series/series-card';
import type { SeriesDetail } from '@/lib/api/types';

export default function FavoritesPage() {
  const t = useTranslations('nav');
  const { session, isLoading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<{ id: string; mangaId: string }[]>([]);
  const [seriesDetails, setSeriesDetails] = useState<SeriesDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      if (authLoading) return;
      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      try {
        // Fetch favorites list
        const favs = await apiGet<{ id: string; mangaId: string }[]>('/users/me/favorites', undefined, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        setFavorites(favs);

        if (favs.length > 0) {
          // Fetch details for each manga ID
          const detailsPromises = favs.map(f => apiGet<SeriesDetail>(`/series/${f.mangaId}`));
          const details = await Promise.allSettled(detailsPromises);
          
          const validDetails = details
            .filter((p): p is PromiseFulfilledResult<SeriesDetail> => p.status === 'fulfilled')
            .map(p => p.value);
            
          setSeriesDetails(validDetails);
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, [session, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen">
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-8">
          {t('favorites')}
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-dark-800 rounded-lg aspect-[2/3] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mb-4">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-text-muted" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Inicia sesión</h2>
        <p className="text-text-muted text-center max-w-sm">
          Debes iniciar sesión para ver tus series favoritas.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen animate-fade-in">
      <h1 className="text-3xl font-extrabold text-white tracking-tight mb-8 flex items-center gap-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gold-500">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        {t('favorites')}
      </h1>

      {seriesDetails.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {seriesDetails.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-dark-800/50 border border-dark-700/50 flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-text-muted" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Aún no tienes favoritos</h3>
          <p className="text-text-muted max-w-sm">
            Explora nuestro catálogo y guarda las series que más te gusten haciendo clic en &quot;Mi Lista&quot;.
          </p>
        </div>
      )}
    </div>
  );
}
