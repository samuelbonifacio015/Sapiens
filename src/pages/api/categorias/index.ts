import type { APIRoute } from 'astro';
import { findAllCategorias, createCategoria } from '../../../lib/repos/categorias.js';
import { categoriaCreateSchema } from '../../../lib/validators/categoria.js';
import { handleApi, json, requireAdmin } from '../../../lib/http.js';

export const prerender = false;

export const GET: APIRoute = () => handleApi(async () => json(await findAllCategorias()));

export const POST: APIRoute = ({ request, locals }) => handleApi(async () => {
  requireAdmin(locals);
  const body = categoriaCreateSchema.parse(await request.json());
  const id = await createCategoria(body);
  return json({ id }, { status: 201 });
});
