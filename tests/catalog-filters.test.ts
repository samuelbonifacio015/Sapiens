import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyCatalogFilters,
  parseCatalogFilters,
  type CatalogItem,
} from '../src/lib/catalog-filters.ts';

const items: CatalogItem[] = [
  {
    tipo: 'libro',
    producto: {
      id_libro: 1,
      isbn: '978-1',
      titulo: 'Zorro',
      precio: 35,
      stock: 4,
      id_categoria: 10,
      id_autor: 1,
    },
  },
  {
    tipo: 'revista',
    producto: {
      id_revista: 1,
      issn: '1111-1111',
      titulo: 'Amauta',
      precio: 12,
      stock: 0,
      id_categoria: 20,
    },
  },
  {
    tipo: 'libro',
    producto: {
      id_libro: 2,
      isbn: '978-2',
      titulo: 'Arguedas',
      precio: 28,
      stock: 0,
      id_categoria: 20,
      id_autor: 2,
    },
  },
];

test('catalog filters parse URL params and ignore invalid categories', () => {
  const params = new URLSearchParams('tipo=libros&categoria=20&categoria=999&stock=1&orden=precio-asc');
  const filters = parseCatalogFilters(params, new Set([10, 20]));

  assert.deepEqual(filters, {
    tipo: 'libros',
    categorias: [20],
    soloConStock: true,
    ordenarPor: 'precio-asc',
  });
});

test('catalog filters apply type, category, stock, and sort rules', () => {
  assert.deepEqual(
    applyCatalogFilters(items, {
      tipo: 'todos',
      categorias: [20],
      soloConStock: false,
      ordenarPor: 'titulo-az',
    }).map(item => item.producto.titulo),
    ['Amauta', 'Arguedas'],
  );

  assert.deepEqual(
    applyCatalogFilters(items, {
      tipo: 'libros',
      categorias: [],
      soloConStock: true,
      ordenarPor: 'precio-desc',
    }).map(item => item.producto.titulo),
    ['Zorro'],
  );
});
