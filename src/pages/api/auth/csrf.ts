import { randomBytes } from 'node:crypto';
import type { APIRoute } from 'astro';
import { CSRF_COOKIE, json } from '../../../lib/http.js';

export const prerender = false;

export const GET: APIRoute = ({ cookies }) => {
  const csrfToken = randomBytes(32).toString('hex');
  cookies.set(CSRF_COOKIE, csrfToken, {
    httpOnly: false,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 2,
  });
  return json({ csrfToken });
};
