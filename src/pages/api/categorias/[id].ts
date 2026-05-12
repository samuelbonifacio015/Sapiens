import type { APIRoute } from 'astro';
import { findCategoriaById, updateCategoria, deleteCategoria } from '../../../lib/repos/categorias.js';
import { categoriaUpdateSchema } from '../../../lib/validators/categoria.js';
import { handleApi, json, noContent, error, requireAdmin, requireCsrf } from '../../../lib/http.js';

export const prerender = false;

export const GET: APIRoute = ({ params }) => handleApi(async () => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return error(400, 'Invalid id');
  const c = await findCategoriaById(id);
  return c ? json(c) : error(404, 'Not found');
});

export const PUT: APIRoute = ({ request, cookies, params, locals }) => handleApi(async () => {
  requireCsrf(request, cookies);
  requireAdmin(locals);
  const id = Number(params.id);
  if (!Number.isFinite(id)) return error(400, 'Invalid id');
  const body = categoriaUpdateSchema.parse(await request.json());
  return (await updateCategoria(id, body)) ? noContent() : error(404, 'Not found');
});

export const DELETE: APIRoute = ({ request, cookies, params, locals }) => handleApi(async () => {
  requireCsrf(request, cookies);
  requireAdmin(locals);
  const id = Number(params.id);
  if (!Number.isFinite(id)) return error(400, 'Invalid id');
  return (await deleteCategoria(id)) ? noContent() : error(404, 'Not found');
});
