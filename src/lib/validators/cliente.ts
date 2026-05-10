import { z } from 'zod';

export const clienteUpdateSchema = z.object({
  nombre_cliente: z.string().min(1).max(255).optional(),
  telefono: z.string().max(20).nullable().optional(),
  direccion: z.string().max(500).nullable().optional(),
});

export type ClienteUpdateInput = z.infer<typeof clienteUpdateSchema>;
