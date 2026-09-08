'use client';

import { useEffect, useState } from 'react';
import { ImageWithLoader } from '@/components/ui/image-with-loader';
import { useTranslations } from 'next-intl';
import { Play, Plus, Check, Share2, Info } from 'lucide-react';
import type { SeriesDetail } from '@/lib/api/types';
import { useAuth } from '@/lib/auth/auth-context';
import { apiGet, apiPost } from '@/lib/api/client';
import { toast } from '@/lib/toast';

interface SeriesSidebarProps {
  series: SeriesDetail;
}

export function SeriesSidebar({ series }: SeriesSidebarProps) {
  const t = useTranslations('detail');
  const tStatus = useTranslations('series.status');
  const coverImage =
    series.coverArtUrl ||
    'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=1920&h=800';

  const normalizedStatus = series.status?.toLowerCase() || '';
  const displayStatus =
    normalizedStatus === 'ongoing' || normalizedStatus === 'en emisión'
      ? tStatus('ongoing')
      : normalizedStatus === 'completed' || normalizedStatus === 'completado'
        ? tStatus('completed')
        : normalizedStatus === 'hiatus' || normalizedStatus === 'en pausa'
          ? tStatus('hiatus')
          : normalizedStatus === 'cancelled' || normalizedStatus === 'cancelado'
            ? tStatus('cancelled')
            : series.status || t('unknownStatus');

  const { session } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(true); // Start true to prevent flash of wrong icon
  
  useEffect(() => {
    async function checkFavorite() {
      if (!session?.access_token) {
        setLoadingFavorite(false);
        return;
      }
      try {
        const data = await apiGet<{ isFavorite: boolean }>(`/users/me/favorites/${series.id}/check`, undefined, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        setIsFavorite(data.isFavorite);
      } catch (err) {
        console.error('Error checking favorite status', err);
      } finally {
        setLoadingFavorite(false);
      }
    }
    checkFavorite();
  }, [series.id, session]);

  const toggleFavorite = async () => {
    if (!session?.access_token) {
      toast.info({ title: 'Atención', description: 'Debes iniciar sesión para guardar en favoritos.' });
      return;
    }
    
    setLoadingFavorite(true);
    try {
      const data = await apiPost<{ isFavorite: boolean }>(`/users/me/favorites/${series.id}`, {}, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setIsFavorite(data.isFavorite);
      if (data.isFavorite) {
        toast.success({ title: 'Guardado', description: 'Añadido a tus favoritos.' });
      } else {
        toast.info({ title: 'Eliminado', description: 'Eliminado de tus favoritos.' });
      }
    } catch (err) {
      toast.error({ title: 'Error', description: 'Ocurrió un error al actualizar favoritos.' });
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: series.title,
      text: series.description?.substring(0, 100) + '...',
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success({ title: 'Enlace copiado', description: 'El enlace se ha copiado al portapapeles.' });
      } catch (err) {
        toast.error({ title: 'Error', description: 'No se pudo copiar el enlace.' });
      }
    }
  };

  return (
    <aside className="w-full space-y-6">
      {/* Contenedor Principal */}
      <div className="flex flex-col animate-[fadeIn_0.5s_ease-out]">
        {/* Portada */}
        <div className="relative w-full aspect-[2/3] rounded-md overflow-hidden shadow-md mx-auto mb-5">
          <ImageWithLoader
            src={coverImage}
            alt={series.title}
            fill
            wrapperClassName="w-full h-full"
            className="object-cover"
            priority
          />
        </div>

        {/* Título y Tooltip de Sinopsis */}
        <div className="flex items-start justify-center gap-2 mb-5 px-2 relative z-50">
          <h1 className="text-2xl font-extrabold text-white text-center tracking-tight leading-snug">
            {series.title}
          </h1>
          {series.description && (
            <div className="relative group flex items-center pt-1 cursor-help">
              <div className="text-text-muted hover:text-white transition-colors">
                <Info size={18} />
              </div>
              {/* Popover/Tooltip de la Sinopsis */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 bg-dark-800 text-text-secondary text-sm rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-dark-700">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-dark-800" />
                <h4 className="text-white font-bold mb-2">{t('synopsis')}</h4>
                <p className="line-clamp-[10]">{series.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col gap-3 w-full">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-white py-3.5 rounded-lg font-bold transition-all shadow-md cursor-pointer"
          >
            <Play size={20} fill="currentColor" />
            <span>{t('startReading')}</span>
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={toggleFavorite}
              disabled={loadingFavorite}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-gold-500/20 text-gold-500 hover:bg-gold-500/30'
                  : 'bg-dark-800 hover:bg-dark-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loadingFavorite ? (
                 <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                   <path d="M21 12a9 9 0 11-6.219-8.56"/>
                 </svg>
              ) : isFavorite ? (
                <Check size={18} />
              ) : (
                <Plus size={18} />
              )}
              <span>{isFavorite ? 'En Mi Lista' : t('myList')}</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="px-4 flex items-center justify-center bg-dark-800 hover:bg-dark-700 text-white py-2.5 rounded-lg transition-colors cursor-pointer"
              aria-label={t('share')}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Metadatos (Tags y Estado) */}
      <div className="space-y-5 pt-2">
        <div>
          <h3 className="text-text-muted text-xs uppercase font-bold tracking-widest mb-3">
            {t('status')}
          </h3>
          <div className="inline-flex items-center gap-2 bg-dark-800/50 px-3 py-1.5 rounded-md">
            <span
              className={`w-2 h-2 rounded-full ${
                normalizedStatus === 'ongoing' || normalizedStatus === 'en emisión'
                  ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                  : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]'
              }`}
            />
            <span className="text-sm font-medium text-text-primary capitalize">
              {displayStatus}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-text-muted text-xs uppercase font-bold tracking-widest mb-3">
            {t('genres')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {series.tags && series.tags.length > 0 ? (
              series.tags.map((genre) => (
                <span
                  key={genre}
                  className="bg-dark-800/50 text-text-secondary text-xs font-medium px-3 py-1.5 rounded-md hover:bg-dark-700 transition-colors"
                >
                  {genre}
                </span>
              ))
            ) : (
              <span className="text-sm text-text-muted">{t('noGenres')}</span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
