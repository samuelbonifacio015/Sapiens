import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const account = readFileSync('src/pages/mi-cuenta/index.astro', 'utf8');
const orders = readFileSync('src/pages/mi-cuenta/pedidos/index.astro', 'utf8');
const orderDetail = readFileSync('src/pages/mi-cuenta/pedidos/[id].astro', 'utf8');

test('customer account pages query only current user orders', () => {
  assert.match(account, /Astro\.locals\.user/);
  assert.match(account, /getPedidosByCliente\(user\.id\)/);
  assert.doesNotMatch(account, /getPedidos\(/);

  assert.match(orders, /Astro\.locals\.user/);
  assert.match(orders, /getPedidosByCliente\(user\.id\)/);
  assert.doesNotMatch(orders, /getPedidos\(/);
});

test('customer order detail rejects orders owned by another user', () => {
  assert.match(orderDetail, /Astro\.locals\.user/);
  assert.match(orderDetail, /pedido\.id_cliente !== user\.id/);
  assert.match(orderDetail, /Astro\.redirect\('\/mi-cuenta\/pedidos'\)/);
});
