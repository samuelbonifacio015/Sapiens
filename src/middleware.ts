import { defineMiddleware } from 'astro:middleware';
import { verifyToken, SESSION_COOKIE } from './lib/auth.js';

export const onRequest = defineMiddleware(async (ctx, next) => {
  const token = ctx.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    const payload = verifyToken(token);
    if (payload) ctx.locals.user = payload;
  }
  return next();
});
