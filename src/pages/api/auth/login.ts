import type { APIRoute } from 'astro';
import { loginSchema } from '../../../lib/validators/auth.js';
import { findClienteByCorreo } from '../../../lib/repos/clientes.js';
import { comparePassword, signToken, SESSION_COOKIE, SESSION_MAX_AGE } from '../../../lib/auth.js';
import { handleApi, json, error } from '../../../lib/http.js';

export const prerender = false;

export const POST: APIRoute = ({ request, cookies }) => handleApi(async () => {
  const { correo, password } = loginSchema.parse(await request.json());
  const u = await findClienteByCorreo(correo);
  if (!u || !u.password_hash || !(await comparePassword(password, u.password_hash))) {
    return error(401, 'Invalid credentials');
  }
  const token = signToken({ id: u.id_cliente, rol: u.rol });
  cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return json({ id: u.id_cliente, rol: u.rol });
});
