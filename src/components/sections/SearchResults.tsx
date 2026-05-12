import { useState, useEffect } from 'react';
import type { Libro, Revista } from '../../types/index.js';
import { getBookCoverSrc } from '../../lib/book-covers.js';
import { getMagazineCoverSrc } from '../../lib/magazine-covers.js';

interface Product {
  producto: Libro | Revista;
  tipo: 'libro' | 'revista';
}

interface SearchResultsProps {
  libros: Libro[];
  revistas: Revista[];
}

function normalizeStr(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function SearchResults({ libros, revistas }: SearchResultsProps) {
  const [query, setQuery] = useState('');
  const [tipo, setTipo] = useState('todo');
  const [results, setResults] = useState<Product[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') ?? '';
    const t = params.get('tipo') ?? 'todo';
    setQuery(q);
    setTipo(t);
    if (q.trim()) {
      runSearch(q, t);
      setSearched(true);
    }
  }, []);

  function runSearch(q: string, t: string) {
    const needle = normalizeStr(q);
    const res: Product[] = [];
    if (t !== 'revistas') {
      libros.filter(l =>
        normalizeStr(l.titulo).includes(needle) ||
        normalizeStr(l.autor?.nombre_autor ?? '').includes(needle) ||
        l.isbn.includes(needle)
      ).forEach(l => res.push({ producto: l, tipo: 'libro' }));
    }
    if (t !== 'libros') {
      revistas.filter(r =>
        normalizeStr(r.titulo).includes(needle) ||
        r.issn.includes(needle)
      ).forEach(r => res.push({ producto: r, tipo: 'revista' }));
    }
    setResults(res);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set('q', query);
      url.searchParams.set('tipo', tipo);
      window.history.pushState({}, '', url.toString());
      runSearch(query, tipo);
      setSearched(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex w-full items-center bg-surface border border-border rounded overflow-hidden focus-within:ring-2 focus-within:ring-[#0D0D0D] transition-shadow mb-8">
        <select
          value={tipo}
          onChange={e => setTipo(e.target.value)}
          aria-label="Filtrar por tipo"
          className="h-full px-4 py-4 bg-surface border-r border-border text-text-muted text-sm font-inter focus:outline-none cursor-pointer"
        >
          <option value="todo">Todo</option>
          <option value="libros">Libros</option>
          <option value="revistas">Revistas</option>
        </select>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Busca por título, autor, ISBN o categoría..."
          aria-label="Buscar"
          className="flex-1 px-5 py-4 bg-surface text-text text-sm font-inter placeholder:text-text-muted focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Buscar"
          className="flex items-center justify-center w-14 bg-[#0D0D0D] text-[#F8F8F5] hover:bg-[#1A1A1A] transition-colors flex-shrink-0"
          style={{ minHeight: '54px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </form>

      {!searched ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4" aria-hidden="true">📖</span>
          <p className="font-inter text-text-muted">Escribe un título, autor o ISBN para buscar.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4" aria-hidden="true">🔍</span>
          <p className="font-inter text-text-muted mb-2">Sin resultados para "{query}"</p>
          <a href="/catalogo" className="text-sm font-inter text-text underline hover:no-underline">Ver todo el catálogo</a>
        </div>
      ) : (
        <div>
          <p className="font-inter text-text-muted text-sm mb-6">
            {results.length} resultado{results.length !== 1 ? 's' : ''} para "{query}"
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {results.map(({ producto, tipo }) => {
              const isLibro = tipo === 'libro';
              const id = (producto as Libro).id_libro ?? (producto as Revista).id_revista ?? 0;
              const href = isLibro ? `/libros/${(producto as Libro).id_libro}` : `/revistas/${(producto as Revista).id_revista}`;
              const coverSrc = isLibro
                ? getBookCoverSrc(producto as Libro)
                : getMagazineCoverSrc(producto as Revista);
              const stock = producto.stock;
              const stockLabel = stock === 0 ? 'Sin stock' : stock <= 4 ? 'Stock limitado' : 'Disponible';
              const stockColor = stock === 0 ? 'text-error' : stock <= 4 ? 'text-warning' : 'text-success';

              return (
                <article key={`${tipo}-${id}`} className="group flex flex-col bg-surface border border-border rounded overflow-hidden hover:border-[#0D0D0D] transition-colors duration-150">
                  <a href={href} className={`block ${isLibro ? 'aspect-[2/3]' : 'aspect-[3/4]'} w-full overflow-hidden bg-[#F4F1EA]`} aria-label={`Ver ${producto.titulo}`}>
                    {coverSrc ? (
                      <img
                        src={coverSrc}
                        alt={`Portada de ${producto.titulo}`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="h-full w-full bg-[#F4F1EA]" />
                    )}
                  </a>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <a href={href}>
                      <h3 className="font-playfair font-medium text-text text-sm leading-tight line-clamp-2 hover:underline">{producto.titulo}</h3>
                    </a>
                    {isLibro && (producto as Libro).autor && (
                      <p className="font-inter text-text-muted text-xs">{(producto as Libro).autor!.nombre_autor}</p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-1">
                      <span className="font-inter font-bold text-text text-sm">S/ {producto.precio.toFixed(2)}</span>
                      <span className={`font-inter text-xs ${stockColor}`}>{stockLabel}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
