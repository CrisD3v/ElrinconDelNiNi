import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  MangaPageLoader,
  TornPanelError,
  InkStampSuccess,
  FeedbackCard,
  FeedbackCardRoot,
  FeedbackCardVolume,
  FeedbackCardTitle,
  FeedbackCardDescription,
} from '../feedback';

describe('Feedback Components (Manga & Editorial)', () => {
  describe('MangaPageLoader', () => {
    it('renders with role="status" and custom label', () => {
      render(
        <MangaPageLoader
          label="Cargando manuscrito..."
          sublabel="Procesando páginas"
        />
      );
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Cargando manuscrito...')).toBeInTheDocument();
      expect(screen.getByText('Procesando páginas')).toBeInTheDocument();
    });

    it('renders size variants without crashing', () => {
      const { rerender } = render(<MangaPageLoader size="sm" label="Pequeño" />);
      expect(screen.getByText('Pequeño')).toBeInTheDocument();

      rerender(<MangaPageLoader size="lg" label="Grande" />);
      expect(screen.getByText('Grande')).toBeInTheDocument();
    });
  });

  describe('TornPanelError', () => {
    it('renders the comic panel error and anomaly badge', () => {
      render(<TornPanelError size="md" showIconBadge={true} />);
      expect(screen.getByText('Anomalía')).toBeInTheDocument();
    });

    it('renders cleanly without badge when disabled', () => {
      render(<TornPanelError size="sm" showIconBadge={false} data-testid="torn-error" />);
      expect(screen.queryByText('Anomalía')).not.toBeInTheDocument();
    });
  });

  describe('InkStampSuccess', () => {
    it('renders the hanko stamp and verified badge', () => {
      render(<InkStampSuccess size="md" showIconBadge={true} />);
      expect(screen.getByText('Verificado')).toBeInTheDocument();
    });
  });

  describe('FeedbackCard & Solid Matte Styling (No Glassmorphism)', () => {
    it('renders solid matte container with manga corner brackets and NO backdrop-blur', () => {
      const { container } = render(
        <FeedbackCardRoot data-testid="feedback-card">
          <FeedbackCardVolume>TOMO I · TEST</FeedbackCardVolume>
          <FeedbackCardTitle>Título Editorial</FeedbackCardTitle>
          <FeedbackCardDescription>Descripción editorial</FeedbackCardDescription>
        </FeedbackCardRoot>
      );

      const card = screen.getByTestId('feedback-card');
      expect(card).toBeInTheDocument();

      // Assert solid matte dark styling
      expect(card.className).toContain('bg-[#18191a]');
      // Assert NO glassmorphism
      expect(card.className).not.toContain('backdrop-blur');

      // Assert decorative corner brackets exist
      expect(container.querySelector('[data-testid="corner-tl"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="corner-tr"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="corner-bl"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="corner-br"]')).toBeInTheDocument();

      expect(screen.getByText('TOMO I · TEST')).toBeInTheDocument();
      expect(screen.getByText('Título Editorial')).toBeInTheDocument();
    });

    it('renders high-level FeedbackCard for loading, error and success', () => {
      const { rerender } = render(
        <FeedbackCard
          type="loading"
          title="Cargando..."
          description="Espere por favor"
        />
      );
      expect(screen.getByText('MANUSCRITO · EN PROCESO')).toBeInTheDocument();
      expect(screen.getByText('Cargando...')).toBeInTheDocument();

      rerender(
        <FeedbackCard
          type="error"
          title="Error en el tomo"
          description="No se pudo abrir"
        />
      );
      expect(screen.getByText('ANOMALÍA · INTERRUPCIÓN')).toBeInTheDocument();
      expect(screen.getByText('Error en el tomo')).toBeInTheDocument();

      rerender(
        <FeedbackCard
          type="success"
          title="Tomo descargado"
          description="Listo para leer"
        />
      );
      expect(screen.getByText('ENTREGA · COMPLETADA')).toBeInTheDocument();
      expect(screen.getByText('Tomo descargado')).toBeInTheDocument();
    });
  });
});
