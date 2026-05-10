import { z } from 'zod';

export const libroCreateSchema = z.object({
  isbn: z.string().min(1).max(20),
  titulo: z.string().min(1).max(500),
  editorial: z.string().max(255).optional().nullable(),
  anio_publicacion: z.number().int().optional().nullable(),
  precio: z.number().nonnegative(),
  stock: z.number().int().nonnegative().default(0),
  id_categoria: z.number().int().positive(),
  id_autor: z.number().int().positive(),
});

export const libroUpdateSchema = libroCreateSchema.partial();

export type LibroCreateInput = z.infer<typeof libroCreateSchema>;
export type LibroUpdateInput = z.infer<typeof libroUpdateSchema>;
