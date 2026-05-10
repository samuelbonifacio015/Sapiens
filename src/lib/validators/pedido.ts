import { z } from 'zod';

export const checkoutItemSchema = z.object({
  tipo_producto: z.enum(['Libro', 'Revista']),
  id_producto: z.number().int().positive(),
  cantidad: z.number().int().positive().max(999),
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
});

export const estadoUpdateSchema = z.object({
  estado: z.string().min(1).max(50),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutItem = z.infer<typeof checkoutItemSchema>;
