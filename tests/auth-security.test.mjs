import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const middleware = readFileSync('src/middleware.ts', 'utf8');
const http = readFileSync('src/lib/http.ts', 'utf8');
const auth = readFileSync('src/lib/auth.ts', 'utf8');
const csrf = readFileSync('src/pages/api/auth/csrf.ts', 'utf8');

test('middleware protects admin, account, and checkout routes', () => {
  assert.match(middleware, /path === '\/admin' \|\| path\.startsWith\('\/admin\/'\)/);
  assert.match(middleware, /ctx\.locals\.user\.rol !== 'ADMIN'/);
  assert.match(middleware, /path === '\/mi-cuenta' \|\| path\.startsWith\('\/mi-cuenta\/'\)/);
  assert.match(middleware, /path === '\/checkout'/);
  assert.match(middleware, /\/iniciar-sesion\?next=/);
});

test('csrf helper and endpoint are wired for mutating requests', () => {
  assert.match(http, /export const CSRF_COOKIE = 'sapiens_csrf'/);
  assert.match(http, /export const requireCsrf/);
  assert.match(http, /x-csrf-token/);
  assert.match(csrf, /randomBytes\(32\)/);
  assert.match(csrf, /httpOnly: false/);
});

test('jwt secret is mandatory in production', () => {
  assert.match(auth, /JWT_SECRET is required in production/);
  assert.match(auth, /process\.env\.NODE_ENV === 'production'/);
});
