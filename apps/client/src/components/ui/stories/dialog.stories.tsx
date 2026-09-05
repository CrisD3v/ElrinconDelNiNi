import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../dialog';
import { Button } from '../button';

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDialog: Story = {
  args: {},
  render: () => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary">Abrir Diálogo</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Título del Diálogo</DialogTitle>
            <DialogDescription>
              Este es un diálogo con el estilo premium dark y dorado de la aplicación.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-sm text-text-secondary">
            Contenido interactivo y accesible del modal.
          </div>
          <DialogFooter>
            <Button variant="secondary">Cancelar</Button>
            <Button variant="primary">Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};
