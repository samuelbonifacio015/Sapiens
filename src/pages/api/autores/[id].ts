import type { APIRoute } from 'astro';
import { findAutorById, updateAutor, deleteAutor } from '../../../lib/repos/autores.js';
import { autorUpdateSchema } from '../../../lib/validators/autor.js';
import { handleApi, json, noContent, error, requireAdmin } from '../../../lib/http.js';

export const prerender = false;

export const GET: APIRoute = ({ params }) => handleApi(async () => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return error(400, 'Invalid id');
  const a = await findAutorById(id);
  return a ? json(a) : error(404, 'Not found');
});

export const PUT: APIRoute = ({ request, params, locals }) => handleApi(async () => {
  requireAdmin(locals);
  const id = Number(params.id);
  if (!Number.isFinite(id)) return error(400, 'Invalid id');
  const body = autorUpdateSchema.parse(await request.json());
  return (await updateAutor(id, body)) ? noContent() : error(404, 'Not found');
});

export const DELETE: APIRoute = ({ params, locals }) => handleApi(async () => {
  requireAdmin(locals);
  const id = Number(params.id);
  if (!Number.isFinite(id)) return error(400, 'Invalid id');
  return (await deleteAutor(id)) ? noContent() : error(404, 'Not found');
});
