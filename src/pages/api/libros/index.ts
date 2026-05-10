import type { APIRoute } from 'astro';
import { findAllLibros, createLibro } from '../../../lib/repos/libros.js';
import { libroCreateSchema } from '../../../lib/validators/libro.js';
import { handleApi, json, requireAdmin } from '../../../lib/http.js';

export const prerender = false;

export const GET: APIRoute = ({ url }) => handleApi(async () => {
  const sp = url.searchParams;
  const libros = await findAllLibros({
    categoria: sp.get('categoria') ? Number(sp.get('categoria')) : undefined,
    autor:     sp.get('autor')     ? Number(sp.get('autor'))     : undefined,
    q:         sp.get('q') ?? undefined,
    page:      sp.get('page')      ? Number(sp.get('page'))      : 1,
    size:      sp.get('size')      ? Number(sp.get('size'))      : 50,
  });
  return json(libros);
});

export const POST: APIRoute = ({ request, locals }) => handleApi(async () => {
  requireAdmin(locals);
  const body = libroCreateSchema.parse(await request.json());
  const id = await createLibro(body);
  return json({ id }, { status: 201 });
});
