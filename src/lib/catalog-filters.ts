import type { Libro, Revista } from '../types/index.js';

export type CatalogTipo = 'todos' | 'libros' | 'revistas';
export type CatalogOrden = 'relevancia' | 'precio-asc' | 'precio-desc' | 'titulo-az';

export interface CatalogFilters {
  tipo: CatalogTipo;
  categorias: number[];
  soloConStock: boolean;
  ordenarPor: CatalogOrden;
}

export interface CatalogItem {
  producto: Libro | Revista;
  tipo: 'libro' | 'revista';
}

export const defaultCatalogFilters: CatalogFilters = {
  tipo: 'todos',
  categorias: [],
  soloConStock: false,
  ordenarPor: 'relevancia',
};

const validTipos = new Set<CatalogTipo>(['todos', 'libros', 'revistas']);
const validOrdenes = new Set<CatalogOrden>(['relevancia', 'precio-asc', 'precio-desc', 'titulo-az']);

const parseCategoryIds = (params: URLSearchParams, allowedCategoryIds?: Set<number>) => {
  const values = params
    .getAll('categoria')
    .flatMap(value => value.split(','))
    .map(value => Number(value))
    .filter(value => Number.isInteger(value) && value > 0);

  const unique = [...new Set(values)];
  return allowedCategoryIds
    ? unique.filter(value => allowedCategoryIds.has(value))
    : unique;
};

export function parseCatalogFilters(
  params: URLSearchParams,
  allowedCategoryIds?: Set<number>,
): CatalogFilters {
  const tipo = params.get('tipo') as CatalogTipo | null;
  const ordenarPor = params.get('orden') as CatalogOrden | null;

  return {
    tipo: tipo && validTipos.has(tipo) ? tipo : defaultCatalogFilters.tipo,
    categorias: parseCategoryIds(params, allowedCategoryIds),
    soloConStock: params.get('stock') === '1',
    ordenarPor: ordenarPor && validOrdenes.has(ordenarPor)
      ? ordenarPor
      : defaultCatalogFilters.ordenarPor,
  };
}

export function applyCatalogFilters(items: CatalogItem[], filters: CatalogFilters): CatalogItem[] {
  const filtered = items.filter(({ producto, tipo }) => {
    if (filters.tipo === 'libros' && tipo !== 'libro') return false;
    if (filters.tipo === 'revistas' && tipo !== 'revista') return false;
    if (filters.categorias.length > 0 && !filters.categorias.includes(producto.id_categoria)) return false;
    if (filters.soloConStock && producto.stock <= 0) return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (filters.ordenarPor) {
      case 'precio-asc':
        return a.producto.precio - b.producto.precio;
      case 'precio-desc':
        return b.producto.precio - a.producto.precio;
      case 'titulo-az':
        return a.producto.titulo.localeCompare(b.producto.titulo, 'es', { sensitivity: 'base' });
      default:
        return 0;
    }
  });
}
