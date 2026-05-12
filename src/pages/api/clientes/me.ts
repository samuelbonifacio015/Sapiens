import type { APIRoute } from 'astro';
import { findClienteById, updateCliente } from '../../../lib/repos/clientes.js';
import { clienteUpdateSchema } from '../../../lib/validators/cliente.js';
import { handleApi, json, error, requireCsrf } from '../../../lib/http.js';

export const prerender = false;

export const GET: APIRoute = ({ locals }) => handleApi(async () => {
  if (!locals.user) return error(401, 'Unauthorized');
  const c = await findClienteById(locals.user.id);
  return c ? json(c) : error(404, 'Not found');
});

export const PUT: APIRoute = ({ request, cookies, locals }) => handleApi(async () => {
  requireCsrf(request, cookies);
  if (!locals.user) return error(401, 'Unauthorized');
  const data = clienteUpdateSchema.parse(await request.json());
  await updateCliente(locals.user.id, data);
  const c = await findClienteById(locals.user.id);
  return c ? json(c) : error(404, 'Not found');
});
