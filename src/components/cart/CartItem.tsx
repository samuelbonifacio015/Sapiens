import { X } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types/index.js';
import type { Libro, Revista } from '../../types/index.js';
import { getBookCoverSrc } from '../../lib/book-covers.js';
import { getMagazineCoverSrc } from '../../lib/magazine-covers.js';

interface CartItemProps {
  item: CartItemType;
  itemKey: string;
  onRemove: (key: string) => void;
  onUpdateQty: (key: string, qty: number) => void;
}

export default function CartItem({ item, itemKey, onRemove, onUpdateQty }: CartItemProps) {
  const isLibro = item.tipo === 'libro';
  const coverSrc = isLibro
    ? getBookCoverSrc(item.producto as Libro)
    : getMagazineCoverSrc(item.producto as Revista);
  const subtotal = item.producto.precio * item.cantidad;
  const autorName = isLibro ? (item.producto as Libro).autor?.nombre_autor : null;
  const stock = Math.max(0, item.producto.stock ?? 0);

  return (
    <div className="flex gap-4 py-5 border-b border-border last:border-0">
      <div className={`flex-shrink-0 w-16 ${isLibro ? 'aspect-[2/3]' : 'aspect-[3/4]'} rounded overflow-hidden bg-[#F4F1EA]`}>
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={`Portada de ${item.producto.titulo}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full bg-[#F4F1EA]"
            role="img"
            aria-label={`Portada no disponible para ${item.producto.titulo}`}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-playfair font-medium text-text text-base line-clamp-2">{item.producto.titulo}</h3>
        {autorName && <p className="font-inter text-xs text-text-muted mt-0.5">{autorName}</p>}
        <p className="font-inter text-xs text-text-muted mt-1 uppercase tracking-wide">{item.tipo}</p>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center border border-border rounded">
            <button
              type="button"
              onClick={() => onUpdateQty(itemKey, item.cantidad - 1)}
              disabled={item.cantidad <= 1}
              aria-label="Reducir cantidad"
              className="w-8 h-8 flex items-center justify-center text-text hover:bg-bg transition-colors disabled:opacity-40 font-inter"
            >
              −
            </button>
            <span className="w-8 text-center font-inter text-sm text-text" aria-live="polite">
              {item.cantidad}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQty(itemKey, item.cantidad + 1)}
              disabled={item.cantidad >= stock}
              aria-label="Aumentar cantidad"
              className="w-8 h-8 flex items-center justify-center text-text hover:bg-bg transition-colors disabled:opacity-40 font-inter"
            >
              +
            </button>
          </div>

          <span className="font-inter text-sm text-text-muted">
            S/ {item.producto.precio.toFixed(2)} c/u
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between flex-shrink-0">
        <button
          type="button"
          onClick={() => onRemove(itemKey)}
          aria-label={`Eliminar ${item.producto.titulo} del carrito`}
          className="text-text-muted hover:text-error transition-colors"
        >
          <X size={16} />
        </button>
        <span className="font-inter font-bold text-text text-base">
          S/ {subtotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
