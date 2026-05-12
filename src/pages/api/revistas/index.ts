import type { APIRoute } from 'astro';
import { findAllRevistas, createRevista } from '../../../lib/repos/revistas.js';
import { revistaCreateSchema } from '../../../lib/validators/revista.js';
import { handleApi, json, requireAdmin, requireCsrf } from '../../../lib/http.js';

export const prerender = false;

export const GET: APIRoute = ({ url }) => handleApi(async () => {
  const sp = url.searchParams;
  return json(await findAllRevistas({
    categoria: sp.get('categoria') ? Number(sp.get('categoria')) : undefined,
    q:         sp.get('q') ?? undefined,
    page:      sp.get('page')      ? Number(sp.get('page'))      : 1,
    size:      sp.get('size')      ? Number(sp.get('size'))      : 50,
  }));
});

export const POST: APIRoute = ({ request, cookies, locals }) => handleApi(async () => {
  requireCsrf(request, cookies);
  requireAdmin(locals);
  const body = revistaCreateSchema.parse(await request.json());
  const id = await createRevista(body);
  return json({ id }, { status: 201 });
});
