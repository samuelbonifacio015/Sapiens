import { useState, type ReactNode } from 'react';
import type { Libro, Revista } from '../../types/index.js';
import { useCart } from '../../lib/cart-store.js';

interface AddToCartButtonProps {
  producto: Libro | Revista;
  tipo: 'libro' | 'revista';
  isAuthenticated: boolean;
  loginHref: string;
  quantity?: number;
  className?: string;
  children?: ReactNode;
}

export default function AddToCartButton({
  producto,
  tipo,
  isAuthenticated,
  loginHref,
  quantity = 1,
  className = '',
  children,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const stock = Math.max(0, producto.stock ?? 0);
  const disabled = stock === 0;

  const handleClick = () => {
    if (!isAuthenticated) {
      window.location.assign(loginHref);
      return;
    }
    if (disabled) return;
    addToCart(producto, tipo, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      aria-label={disabled ? 'Sin stock' : `Agregar ${producto.titulo} al carrito`}
      className={className}
    >
      {disabled ? 'Sin stock' : added ? 'Agregado' : children ?? 'Agregar al carrito'}
    </button>
  );
}
