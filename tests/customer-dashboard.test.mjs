import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const account = readFileSync('src/pages/mi-cuenta/index.astro', 'utf8');
const orders = readFileSync('src/pages/mi-cuenta/pedidos/index.astro', 'utf8');

test('customer dashboard shows account data, order status, and useful paths', () => {
  for (const expected of ['Datos de cuenta', 'Pedidos activos', 'Estado de pedidos', 'Explorar catalogo', 'Centro de ayuda']) {
    assert.ok(account.includes(expected), `${expected} should appear on the customer dashboard`);
  }

  assert.match(account, /findClienteById\(user\.id\)/);
  assert.match(account, /getPedidosByCliente\(user\.id\)/);
});

test('customer orders page keeps scoped empty states and active counts', () => {
  assert.match(orders, /getPedidosByCliente\(user\.id\)/);
  assert.ok(orders.includes('Aun no hay pedidos en tu cuenta'));
  assert.ok(orders.includes('activePedidos'));
});
