import { z } from 'zod';

export const autorCreateSchema = z.object({
  nombre_autor: z.string().min(1).max(255),
  nacionalidad: z.string().max(100).optional().nullable(),
});

export const autorUpdateSchema = autorCreateSchema.partial();

export type AutorCreateInput = z.infer<typeof autorCreateSchema>;
export type AutorUpdateInput = z.infer<typeof autorUpdateSchema>;
