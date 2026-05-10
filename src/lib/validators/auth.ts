import { z } from 'zod';

export const registerSchema = z.object({
  nombre_cliente: z.string().min(1).max(255),
  correo: z.string().email().max(255),
  password: z.string().min(8).max(128),
  telefono: z.string().max(20).optional().nullable(),
  direccion: z.string().max(500).optional().nullable(),
});

export const loginSchema = z.object({
  correo: z.string().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
