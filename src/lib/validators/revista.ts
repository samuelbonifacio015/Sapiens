import { z } from 'zod';

export const revistaCreateSchema = z.object({
  issn: z.string().min(1).max(20),
  titulo: z.string().min(1).max(500),
  editorial: z.string().max(255).optional().nullable(),
  frecuencia: z.string().max(50).optional().nullable(),
  precio: z.number().nonnegative(),
  stock: z.number().int().nonnegative().default(0),
  id_categoria: z.number().int().positive(),
});

export const revistaUpdateSchema = revistaCreateSchema.partial();

export type RevistaCreateInput = z.infer<typeof revistaCreateSchema>;
export type RevistaUpdateInput = z.infer<typeof revistaUpdateSchema>;
