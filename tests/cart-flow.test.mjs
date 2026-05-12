import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const middleware = readFileSync('src/middleware.ts', 'utf8');
const productCard = readFileSync('src/components/ui/ProductCard.astro', 'utf8');
const bookDetail = readFileSync('src/pages/libros/[id].astro', 'utf8');
const magazineDetail = readFileSync('src/pages/revistas/[id].astro', 'utf8');
const header = readFileSync('src/components/layout/Header.astro', 'utf8');
const cartStore = readFileSync('src/lib/cart-store.ts', 'utf8');
const cartSummary = readFileSync('src/components/cart/CartSummary.tsx', 'utf8');
const checkoutWizard = readFileSync('src/components/cart/CheckoutWizard.tsx', 'utf8');

test('cart and checkout routes require an authenticated customer session', () => {
  assert.match(middleware, /path === '\/carrito'/);
  assert.match(middleware, /path === '\/checkout'/);
  assert.match(middleware, /\/iniciar-sesion\?next=/);
});

test('catalog and detail product actions use cart React components', () => {
  assert.match(productCard, /import AddToCartButton from/);
  assert.match(productCard, /<AddToCartButton\b/);
  assert.match(bookDetail, /import ProductPurchasePanel from/);
  assert.match(bookDetail, /<ProductPurchasePanel\b/);
  assert.match(magazineDetail, /import ProductPurchasePanel from/);
  assert.match(magazineDetail, /<ProductPurchasePanel\b/);
});

test('header shows reactive cart badge and drawer controls', () => {
  assert.match(header, /import HeaderCart from/);
  assert.match(header, /<HeaderCart\s+client:load/);
  assert.match(header, /cart-update/);
});

test('cart store caps quantity by stock and publishes updates', () => {
  assert.match(cartStore, /Math\.min\(stock, currentQty \+ qty\)/);
  assert.match(cartStore, /Math\.min\(stock, Math\.max\(1, cantidad\)\)/);
  assert.match(cartStore, /new CustomEvent\('cart-update'/);
  assert.match(cartStore, /getProductStock/);
});

test('cart summary reflects product totals without unsupported shipping calculation', () => {
  assert.doesNotMatch(cartSummary, /departamento/);
  assert.doesNotMatch(cartSummary, /shipping/);
  assert.match(cartSummary, /subtotal\.toFixed\(2\)/);
});

test('checkout updates customer profile before creating the order', () => {
  assert.match(checkoutWizard, /fetch\('\/api\/clientes\/me'\)/);
  assert.match(checkoutWizard, /method: 'PUT'/);
  assert.match(checkoutWizard, /fetch\('\/api\/pedidos'/);
  assert.match(checkoutWizard, /clearCart\(\)/);
  assert.doesNotMatch(checkoutWizard, /dni/i);
  assert.doesNotMatch(checkoutWizard, /tipoEntrega/);
});
