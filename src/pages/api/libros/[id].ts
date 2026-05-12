import type { APIRoute } from 'astro';
import { findLibroById, updateLibro, deleteLibro } from '../../../lib/repos/libros.js';
import { libroUpdateSchema } from '../../../lib/validators/libro.js';
import { handleApi, json, noContent, error, requireAdmin, requireCsrf } from '../../../lib/http.js';

export const prerender = false;

export const GET: APIRoute = ({ params }) => handleApi(async () => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return error(400, 'Invalid id');
  const libro = await findLibroById(id);
  if (!libro) return error(404, 'Not found');
  return json(libro);
});

export const PUT: APIRoute = ({ request, cookies, params, locals }) => handleApi(async () => {
  requireCsrf(request, cookies);
  requireAdmin(locals);
  const id = Number(params.id);
  if (!Number.isFinite(id)) return error(400, 'Invalid id');
  const body = libroUpdateSchema.parse(await request.json());
  const ok = await updateLibro(id, body);
  return ok ? noContent() : error(404, 'Not found');
});

export const DELETE: APIRoute = ({ request, cookies, params, locals }) => handleApi(async () => {
  requireCsrf(request, cookies);
  requireAdmin(locals);
  const id = Number(params.id);
  if (!Number.isFinite(id)) return error(400, 'Invalid id');
  const ok = await deleteLibro(id);
  return ok ? noContent() : error(404, 'Not found');
});
