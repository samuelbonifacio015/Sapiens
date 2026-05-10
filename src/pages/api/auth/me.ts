import type { APIRoute } from 'astro';
import { findClienteById } from '../../../lib/repos/clientes.js';
import { handleApi, json, error } from '../../../lib/http.js';

export const prerender = false;

export const GET: APIRoute = ({ locals }) => handleApi(async () => {
  if (!locals.user) return error(401, 'Unauthorized');
  const c = await findClienteById(locals.user.id);
  return c ? json(c) : error(404, 'Not found');
});
