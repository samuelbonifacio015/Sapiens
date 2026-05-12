import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const admin = readFileSync('src/pages/admin/index.astro', 'utf8');
const adminLayout = readFileSync('src/components/layout/AdminLayout.astro', 'utf8');

test('admin dashboard focuses on security and scale readiness', () => {
  for (const expected of ['Seguridad y escala', '8,000 usuarios', 'Readiness del informe']) {
    assert.ok(admin.includes(expected), `${expected} should appear on the admin dashboard`);
  }

  for (const control of ['Sesion JWT', 'Rutas privadas', 'CSRF', 'Pool MySQL', 'TLS DB', 'Backups']) {
    assert.ok(admin.includes(control), `${control} readiness control should be visible`);
  }
});

test('admin layout supports class-based theme toggle', () => {
  assert.match(adminLayout, /localStorage\.getItem\('theme'\)/);
  assert.match(adminLayout, /id="admin-theme-toggle"/);
  assert.match(adminLayout, /document\.documentElement\.classList\.contains\('dark'\)/);
});
