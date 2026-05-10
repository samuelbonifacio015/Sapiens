import type { APIRoute } from 'astro';
import { findRevistaById, updateRevista, deleteRevista } from '../../../lib/repos/revistas.js';
import { revistaUpdateSchema } from '../../../lib/validators/revista.js';
import { handleApi, json, noContent, error, requireAdmin } from '../../../lib/http.js';

export const prerender = false;

export const GET: APIRoute = ({ params }) => handleApi(async () => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return error(400, 'Invalid id');
  const r = await findRevistaById(id);
  return r ? json(r) : error(404, 'Not found');
});

export const PUT: APIRoute = ({ request, params, locals }) => handleApi(async () => {
  requireAdmin(locals);
  const id = Number(params.id);
  if (!Number.isFinite(id)) return error(400, 'Invalid id');
  const body = revistaUpdateSchema.parse(await request.json());
  return (await updateRevista(id, body)) ? noContent() : error(404, 'Not found');
});

export const DELETE: APIRoute = ({ params, locals }) => handleApi(async () => {
  requireAdmin(locals);
  const id = Number(params.id);
  if (!Number.isFinite(id)) return error(400, 'Invalid id');
  return (await deleteRevista(id)) ? noContent() : error(404, 'Not found');
});
