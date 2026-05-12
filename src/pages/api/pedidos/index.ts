import type { APIRoute } from 'astro';
import { checkout, findPedidosByCliente, findAllPedidos } from '../../../lib/repos/pedidos.js';
import { checkoutSchema } from '../../../lib/validators/pedido.js';
import { handleApi, json, requireCsrf, requireUser } from '../../../lib/http.js';

export const prerender = false;

export const GET: APIRoute = ({ locals }) => handleApi(async () => {
  const u = requireUser(locals);
  const list = u.rol === 'ADMIN' ? await findAllPedidos() : await findPedidosByCliente(u.id);
  return json(list);
});

export const POST: APIRoute = ({ request, cookies, locals }) => handleApi(async () => {
  requireCsrf(request, cookies);
  const u = requireUser(locals);
  const { items } = checkoutSchema.parse(await request.json());
  const id = await checkout(u.id, items);
  return json({ id_pedido: id }, { status: 201 });
});
