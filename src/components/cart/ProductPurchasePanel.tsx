import { useState } from 'react';
import type { Libro, Revista } from '../../types/index.js';
import { useCart } from '../../lib/cart-store.js';
import AddToCartButton from './AddToCartButton.js';

interface ProductPurchasePanelProps {
  producto: Libro | Revista;
  tipo: 'libro' | 'revista';
  isAuthenticated: boolean;
  loginHref: string;
}

const primaryButtonClass =
  'w-full py-4 bg-[#0D0D0D] text-[#F8F8F5] font-inter font-medium text-sm rounded hover:bg-[#1A1A1A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

export default function ProductPurchasePanel({
  producto,
  tipo,
  isAuthenticated,
  loginHref,
}: ProductPurchasePanelProps) {
  const { addToCart } = useCart();
  const stock = Math.max(0, producto.stock ?? 0);
  const [quantity, setQuantity] = useState(1);
  const canBuy = stock > 0;

  const changeQuantity = (next: number) => {
    setQuantity(Math.min(stock, Math.max(1, next)));
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      window.location.assign(loginHref);
      return;
    }
    addToCart(producto, tipo, tipo === 'libro' ? quantity : 1);
    window.setTimeout(() => window.location.assign('/carrito'), 0);
  };

  return (
    <div className="flex flex-col gap-3 pt-2">
      {tipo === 'libro' && (
        <div className="flex items-center gap-4">
          <span className="font-inter text-sm text-text-muted">Cantidad</span>
          <div className="flex items-center border border-border rounded">
            <button
              type="button"
              onClick={() => changeQuantity(quantity - 1)}
              disabled={!canBuy || quantity <= 1}
              aria-label="Reducir cantidad"
              className="w-10 h-10 flex items-center justify-center text-text hover:bg-bg transition-colors disabled:opacity-40 font-inter text-lg"
            >
              -
            </button>
            <span className="w-12 text-center font-inter text-sm text-text" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => changeQuantity(quantity + 1)}
              disabled={!canBuy || quantity >= stock}
              aria-label="Aumentar cantidad"
              className="w-10 h-10 flex items-center justify-center text-text hover:bg-bg transition-colors disabled:opacity-40 font-inter text-lg"
            >
              +
            </button>
          </div>
        </div>
      )}

      <AddToCartButton
        producto={producto}
        tipo={tipo}
        isAuthenticated={isAuthenticated}
        loginHref={loginHref}
        quantity={tipo === 'libro' ? quantity : 1}
        className={primaryButtonClass}
      />

      {tipo === 'libro' && (
        <button
          type="button"
          disabled={!canBuy}
          onClick={handleBuyNow}
          aria-label={canBuy ? `Comprar ${producto.titulo} ahora` : 'Sin stock'}
          className="w-full py-4 bg-transparent border border-[#0D0D0D] text-[#0D0D0D] font-inter font-medium text-sm rounded hover:bg-[#0D0D0D] hover:text-[#F8F8F5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {canBuy ? 'Comprar ahora' : 'No disponible'}
        </button>
      )}
    </div>
  );
}
