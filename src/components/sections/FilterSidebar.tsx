import { useState } from 'react';
import { X } from 'lucide-react';
import { defaultCatalogFilters, type CatalogFilters } from '../../lib/catalog-filters';

type FilterState = CatalogFilters;

interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
  count?: number;
}

interface FilterSidebarProps {
  categorias: Categoria[];
  onFilterChange?: (filters: FilterState) => void;
  className?: string;
}

const defaultFilters: FilterState = defaultCatalogFilters;

const readFiltersFromUrl = (): FilterState => {
  if (typeof window === 'undefined') return defaultFilters;

  const params = new URLSearchParams(window.location.search);
  const tipo = params.get('tipo') as FilterState['tipo'] | null;
  const ordenarPor = params.get('orden') as FilterState['ordenarPor'] | null;
  const categorias = params
    .getAll('categoria')
    .flatMap(value => value.split(','))
    .map(value => Number(value))
    .filter(value => Number.isInteger(value) && value > 0);

  return {
    tipo: tipo && ['todos', 'libros', 'revistas'].includes(tipo) ? tipo : defaultFilters.tipo,
    categorias: [...new Set(categorias)],
    soloConStock: params.get('stock') === '1',
    ordenarPor: ordenarPor && ['relevancia', 'precio-asc', 'precio-desc', 'titulo-az'].includes(ordenarPor)
      ? ordenarPor
      : defaultFilters.ordenarPor,
  };
};

const writeFiltersToUrl = (filters: FilterState) => {
  const url = new URL(window.location.href);
  url.searchParams.delete('tipo');
  url.searchParams.delete('categoria');
  url.searchParams.delete('stock');
  url.searchParams.delete('orden');

  if (filters.tipo !== defaultFilters.tipo) url.searchParams.set('tipo', filters.tipo);
  for (const categoria of filters.categorias) {
    url.searchParams.append('categoria', String(categoria));
  }
  if (filters.soloConStock) url.searchParams.set('stock', '1');
  if (filters.ordenarPor !== defaultFilters.ordenarPor) url.searchParams.set('orden', filters.ordenarPor);

  window.location.assign(url.toString());
};

export default function FilterSidebar({ categorias, onFilterChange, className = '' }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>(() => readFiltersFromUrl());
  const [mobileOpen, setMobileOpen] = useState(false);

  const update = (patch: Partial<FilterState>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    if (onFilterChange) {
      onFilterChange(next);
      return;
    }
    writeFiltersToUrl(next);
  };

  const toggleCategoria = (id: number) => {
    const cats = filters.categorias.includes(id)
      ? filters.categorias.filter(c => c !== id)
      : [...filters.categorias, id];
    update({ categorias: cats });
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    if (onFilterChange) {
      onFilterChange(defaultFilters);
      return;
    }
    writeFiltersToUrl(defaultFilters);
  };

  const hasFilters =
    filters.tipo !== 'todos' ||
    filters.categorias.length > 0 ||
    filters.soloConStock ||
    filters.ordenarPor !== 'relevancia';

  const content = (
    <div className="flex flex-col gap-6">
      {/* Tipo */}
      <div>
        <h3 className="text-xs font-inter font-semibold uppercase tracking-widest text-text-muted mb-3">
          Tipo de producto
        </h3>
        <div className="flex flex-col gap-2">
          {(['todos', 'libros', 'revistas'] as const).map(t => (
            <label key={t} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="tipo"
                value={t}
                checked={filters.tipo === t}
                onChange={() => update({ tipo: t })}
                className="accent-[#0D0D0D]"
              />
              <span className="font-inter text-sm text-text capitalize">{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categorías */}
      <div>
        <h3 className="text-xs font-inter font-semibold uppercase tracking-widest text-text-muted mb-3">
          Categoría
        </h3>
        <div className="flex flex-col gap-2">
          {categorias.map(cat => (
            <label key={cat.id_categoria} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                value={cat.id_categoria}
                checked={filters.categorias.includes(cat.id_categoria)}
                onChange={() => toggleCategoria(cat.id_categoria)}
                className="accent-[#0D0D0D] rounded"
              />
              <span className="font-inter text-sm text-text flex-1">
                {cat.nombre_categoria}
                {cat.count !== undefined && (
                  <span className="text-text-muted ml-1">({cat.count})</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Disponibilidad */}
      <div>
        <h3 className="text-xs font-inter font-semibold uppercase tracking-widest text-text-muted mb-3">
          Disponibilidad
        </h3>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.soloConStock}
            onChange={e => update({ soloConStock: e.target.checked })}
            className="accent-[#0D0D0D] rounded"
          />
          <span className="font-inter text-sm text-text">Solo con stock</span>
        </label>
      </div>

      {/* Ordenar */}
      <div>
        <h3 className="text-xs font-inter font-semibold uppercase tracking-widest text-text-muted mb-3">
          Ordenar por
        </h3>
        <select
          value={filters.ordenarPor}
          onChange={e => update({ ordenarPor: e.target.value as FilterState['ordenarPor'] })}
          aria-label="Ordenar productos"
          className="w-full px-3 py-2 bg-surface border border-border text-text text-sm font-inter rounded focus:outline-none focus:ring-1 focus:ring-[#0D0D0D]"
        >
          <option value="relevancia">Relevancia</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="titulo-az">Título A-Z</option>
        </select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm font-inter text-text-muted underline hover:text-text transition-colors text-left"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir filtros"
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded text-sm font-inter text-text"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
        Filtros
        {hasFilters && <span className="w-2 h-2 bg-[#0D0D0D] rounded-full" aria-hidden="true"></span>}
      </button>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:block w-[240px] flex-shrink-0 ${className}`} aria-label="Filtros de búsqueda">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filtros"
        >
          <div
            className="absolute inset-0 bg-[#0D0D0D]/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-[280px] bg-surface h-full overflow-y-auto p-6 flex flex-col gap-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair font-bold text-xl text-text">Filtros</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar filtros"
                className="text-text-muted hover:text-text transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
