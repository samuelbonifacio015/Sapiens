import type { APIRoute } from 'astro';
import { findAllAutores, createAutor } from '../../../lib/repos/autores.js';
import { autorCreateSchema } from '../../../lib/validators/autor.js';
import { handleApi, json, requireAdmin, requireCsrf } from '../../../lib/http.js';

export const prerender = false;

export const GET: APIRoute = () => handleApi(async () => json(await findAllAutores()));

export const POST: APIRoute = ({ request, cookies, locals }) => handleApi(async () => {
  requireCsrf(request, cookies);
  requireAdmin(locals);
  const body = autorCreateSchema.parse(await request.json());
  const id = await createAutor(body);
  return json({ id }, { status: 201 });
});
