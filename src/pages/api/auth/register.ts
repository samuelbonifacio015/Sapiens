import type { APIRoute } from 'astro';
import { registerSchema } from '../../../lib/validators/auth.js';
import { createCliente, findClienteByCorreo } from '../../../lib/repos/clientes.js';
import { hashPassword, signToken, SESSION_COOKIE, SESSION_MAX_AGE } from '../../../lib/auth.js';
import { handleApi, json, error } from '../../../lib/http.js';

export const prerender = false;

export const POST: APIRoute = ({ request, cookies }) => handleApi(async () => {
  const data = registerSchema.parse(await request.json());
  if (await findClienteByCorreo(data.correo)) return error(409, 'Email already registered');

  const password_hash = await hashPassword(data.password);
  const id = await createCliente({
    nombre_cliente: data.nombre_cliente,
    correo: data.correo,
    password_hash,
    telefono: data.telefono ?? null,
    direccion: data.direccion ?? null,
  });

  const token = signToken({ id, rol: 'USER' });
  cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return json({ id, rol: 'USER' }, { status: 201 });
});
