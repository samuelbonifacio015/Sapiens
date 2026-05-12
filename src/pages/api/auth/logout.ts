import type { APIRoute } from 'astro';
import { SESSION_COOKIE } from '../../../lib/auth.js';
import { handleApi, noContent, requireCsrf } from '../../../lib/http.js';

export const prerender = false;

export const POST: APIRoute = ({ request, cookies }) => handleApi(async () => {
  requireCsrf(request, cookies);
  cookies.delete(SESSION_COOKIE, { path: '/' });
  return noContent();
});
