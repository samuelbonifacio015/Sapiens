import type { APIRoute } from 'astro';
import { SESSION_COOKIE } from '../../../lib/auth.js';
import { noContent } from '../../../lib/http.js';

export const prerender = false;

export const POST: APIRoute = ({ cookies }) => {
  cookies.delete(SESSION_COOKIE, { path: '/' });
  return noContent();
};
