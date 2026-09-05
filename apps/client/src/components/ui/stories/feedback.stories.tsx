import type { Meta, StoryObj } from '@storybook/react';
import {
  MangaPageLoader,
  TornPanelError,
  InkStampSuccess,
  FeedbackCard,
  FeedbackCardRoot,
  FeedbackCardVolume,
  FeedbackCardGraphic,
  FeedbackCardTitle,
  FeedbackCardDescription,
  FeedbackCardActions,
} from '../feedback';
import { Button } from '../button';

const meta = {
  title: 'UI/Feedback',
  component: FeedbackCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FeedbackCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Loader artesanal de páginas de Manga hojeándose con Anime.js (3 capas escalonadas, partículas de tinta dorada flotantes e icono editorial).
 */
export const MangaLoaderHero: Story = {
  render: () => (
    <div className="p-10 bg-[#161718] rounded-2xl border border-[#3e4242]">
      <MangaPageLoader
        size="lg"
        label="Preparando el manuscrito..."
        sublabel="Entintando y procesando páginas en alta definición sin desenfoques artificiales."
        showFilament={true}
        showIconBadge={true}
      />
    </div>
  ),
};

/**
 * Loader artesanal en tamaños estándar y compacto para navegación o botones.
 */
export const MangaLoaderSizes: Story = {
  render: () => (
    <div className="flex gap-8 items-center p-8 bg-[#161718] rounded-2xl border border-[#3e4242]">
      <MangaPageLoader size="sm" label="Cargando..." showFilament={false} showIconBadge={false} />
      <MangaPageLoader size="md" label="Sincronizando tomo..." showFilament={true} showIconBadge={true} />
    </div>
  ),
};

/**
 * Tarjeta sólida mate de carga (sin glassmorphism, con esquinas de viñeta manga y micro-badge editorial).
 */
export const LoadingCard: Story = {
  render: () => (
    <FeedbackCard
      type="loading"
      volumeLabel="TOMO I · SINCRONIZACIÓN"
      title="Sincronizando biblioteca..."
      description="Descargando los últimos tomos y capítulos leídos desde tu perfil en El Rincón del NiNi."
    />
  ),
};

/**
 * Tarjeta sólida mate de Error con impacto elástico de Anime.js, grieta SVG y gotas de tinta carmesí.
 */
export const ErrorCard: Story = {
  render: () => (
    <FeedbackCard
      type="error"
      volumeLabel="ANOMALÍA · INTERRUPCIÓN"
      title="Se interrumpió el capítulo"
      description="No pudimos entintar esta página debido a un problema de conexión con el servidor. ¿Deseas reintentar la lectura?"
      action={
        <Button variant="secondary" onClick={() => alert('Reintentando lectura...')}>
          Reintentar lectura
        </Button>
      }
    />
  ),
};

/**
 * Tarjeta sólida mate de Éxito con sello Hanko editorial animado y badge verificado.
 */
export const SuccessCard: Story = {
  render: () => (
    <FeedbackCard
      type="success"
      volumeLabel="ENTREGA · TOMO SELLADO"
      title="¡Tomo guardado en tu colección!"
      description="Tus marcadores de lectura y preferencias se han sincronizado correctamente en la biblioteca."
      action={
        <Button variant="primary" onClick={() => alert('Continuar lectura')}>
          Continuar leyendo
        </Button>
      }
    />
  ),
};

/**
 * Ilustración individual de Viñeta Rasgada (TornPanelError).
 */
export const TornPanelGraphic: Story = {
  render: () => (
    <div className="p-8 bg-[#18191a] rounded-2xl border border-[#3e4242] flex flex-col items-center gap-4">
      <TornPanelError size="lg" showIconBadge={true} />
      <span className="text-xs text-text-muted font-mono tracking-wider">TornPanelError (Anime.js + SVG)</span>
    </div>
  ),
};

/**
 * Ilustración individual de Sello Hanko (InkStampSuccess).
 */
export const InkStampGraphic: Story = {
  render: () => (
    <div className="p-8 bg-[#18191a] rounded-2xl border border-[#3e4242] flex flex-col items-center gap-4">
      <InkStampSuccess size="lg" showIconBadge={true} />
      <span className="text-xs text-text-muted font-mono tracking-wider">InkStampSuccess (Anime.js + SVG)</span>
    </div>
  ),
};

/**
 * Composición personalizada usando el patrón Compound Components.
 */
export const CompoundCustomComposition: Story = {
  render: () => (
    <FeedbackCardRoot>
      <FeedbackCardVolume className="text-amber-300 border-amber-500/40 bg-amber-950/20">
        EDICIÓN ESPECIAL · MANUSCRITO
      </FeedbackCardVolume>
      <FeedbackCardGraphic type="loading" />
      <FeedbackCardTitle>Descargando Tomo Offline</FeedbackCardTitle>
      <FeedbackCardDescription>
        Almacenando 45 páginas en caché local para lectura sin conexión en el visor de manhwa.
      </FeedbackCardDescription>
      <FeedbackCardActions>
        <Button variant="outline" size="sm">
          Pausar descarga
        </Button>
        <Button variant="secondary" size="sm">
          Detalles del archivo
        </Button>
      </FeedbackCardActions>
    </FeedbackCardRoot>
  ),
};
