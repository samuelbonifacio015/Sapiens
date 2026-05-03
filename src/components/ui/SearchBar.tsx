import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string, type: string) => void;
  initialQuery?: string;
}

export default function SearchBar({
  placeholder = 'Busca por título, autor, ISBN o categoría...',
  onSearch,
  initialQuery = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState('todo');
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      if (timer) clearTimeout(timer);
      const t = setTimeout(() => {
        onSearch?.(val, type);
      }, 300);
      setTimer(t);
    },
    [timer, type, onSearch]
  );

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    onSearch?.(query, e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timer) clearTimeout(timer);
    if (query.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(query)}&tipo=${type}`;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex w-full items-center bg-surface border border-border rounded overflow-hidden focus-within:ring-2 focus-within:ring-[#0D0D0D] transition-shadow"
    >
      <select
        value={type}
        onChange={handleTypeChange}
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
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Buscar"
        className="flex-1 px-5 py-4 bg-surface text-text text-sm font-inter placeholder:text-text-muted focus:outline-none"
      />

      <button
        type="submit"
        aria-label="Realizar búsqueda"
        className="flex items-center justify-center w-14 h-full bg-[#0D0D0D] text-[#F8F8F5] hover:bg-[#1A1A1A] transition-colors flex-shrink-0"
        style={{ minHeight: '54px' }}
      >
        <Search size={18} />
      </button>
    </form>
  );
}
