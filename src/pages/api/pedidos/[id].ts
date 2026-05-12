import type { APIRoute } from 'astro';
import { findPedidoById, findDetallesByPedido, updateEstadoPedido } from '../../../lib/repos/pedidos.js';
import { estadoUpdateSchema } from '../../../lib/validators/pedido.js';
import { handleApi, json, error, requireUser, requireAdmin, requireCsrf } from '../../../lib/http.js';

export const prerender = false;

export const GET: APIRoute = ({ params, locals }) => handleApi(async () => {
  const u = requireUser(locals);
  const id = Number(params.id);
  const p = await findPedidoById(id);
  if (!p) return error(404, 'Not found');
  if (u.rol !== 'ADMIN' && p.id_cliente !== u.id) return error(403, 'Forbidden');
  p.detalles = await findDetallesByPedido(id);
  return json(p);
});

export const PATCH: APIRoute = ({ params, request, cookies, locals }) => handleApi(async () => {
  requireCsrf(request, cookies);
  requireAdmin(locals);
  const id = Number(params.id);
  const { estado } = estadoUpdateSchema.parse(await request.json());
  const ok = await updateEstadoPedido(id, estado);
  if (!ok) return error(404, 'Not found');
  const p = await findPedidoById(id);
  return json(p);
});
