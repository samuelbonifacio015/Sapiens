import { defineMiddleware } from 'astro:middleware';
import { verifyToken, SESSION_COOKIE } from './lib/auth.js';

export const onRequest = defineMiddleware(async (ctx, next) => {
  const token = ctx.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    const payload = verifyToken(token);
    if (payload) ctx.locals.user = payload;
  }

  const path = ctx.url.pathname;
  const current = `${path}${ctx.url.search}`;
  const loginUrl = `/iniciar-sesion?next=${encodeURIComponent(current)}`;

  if (path === '/admin' || path.startsWith('/admin/')) {
    if (!ctx.locals.user) return ctx.redirect(loginUrl);
    if (ctx.locals.user.rol !== 'ADMIN') return ctx.redirect('/mi-cuenta');
  }

  if ((path === '/mi-cuenta' || path.startsWith('/mi-cuenta/') || path === '/checkout') && !ctx.locals.user) {
    return ctx.redirect(loginUrl);
  }

  return next();
});
