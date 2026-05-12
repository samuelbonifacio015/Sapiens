import { ZodError } from 'zod';

export const CSRF_COOKIE = 'sapiens_csrf';

interface CookieReader {
  get(name: string): { value: string } | undefined;
}

export const json = (data: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });

export const noContent = () => new Response(null, { status: 204 });

export const error = (status: number, message: string, extra?: Record<string, unknown>) =>
  json({ error: message, ...(extra ?? {}) }, { status });

export const handleApi = (fn: () => Promise<Response>) =>
  fn().catch((e: unknown) => {
    if (e instanceof ZodError) return error(400, 'Validation failed', { issues: e.issues });
    if (e instanceof ApiError) return error(e.status, e.message);
    if (e instanceof Error) {
      console.error('[api]', e);
      return error(500, e.message);
    }
    console.error('[api]', e);
    return error(500, 'Internal error');
  });

export const requireUser = (locals: App.Locals) => {
  if (!locals.user) throw new ApiError(401, 'Unauthorized');
  return locals.user;
};

export const requireAdmin = (locals: App.Locals) => {
  const u = requireUser(locals);
  if (u.rol !== 'ADMIN') throw new ApiError(403, 'Forbidden');
  return u;
};

export const requireCsrf = (request: Request, cookies: CookieReader) => {
  const headerToken = request.headers.get('x-csrf-token');
  const cookieToken = cookies.get(CSRF_COOKIE)?.value;
  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    throw new ApiError(403, 'Invalid CSRF token');
  }
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
