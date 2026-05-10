import { z } from 'zod';

export const categoriaCreateSchema = z.object({
  nombre_categoria: z.string().min(1).max(255),
  descripcion: z.string().optional().nullable(),
});

export const categoriaUpdateSchema = categoriaCreateSchema.partial();

export type CategoriaCreateInput = z.infer<typeof categoriaCreateSchema>;
export type CategoriaUpdateInput = z.infer<typeof categoriaUpdateSchema>;
