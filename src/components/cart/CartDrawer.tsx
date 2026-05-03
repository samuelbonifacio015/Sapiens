import { useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../lib/cart-store.js';
import CartItemComponent from './CartItem.js';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, total, count, removeFromCart, updateQty, productKey } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      <div className="absolute inset-0 bg-[#0D0D0D]/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface h-full flex flex-col shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="font-playfair font-bold text-xl text-text">
            Carrito {count > 0 && <span className="font-inter text-sm text-text-muted font-normal">({count})</span>}
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar carrito" className="text-text-muted hover:text-text transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <ShoppingBag size={48} className="text-border mb-4" aria-hidden="true" />
              <p className="font-inter text-text-muted text-base">Tu carrito está vacío</p>
              <a href="/catalogo" onClick={onClose} className="mt-4 text-sm font-inter text-text underline hover:no-underline">
                Explorar catálogo
              </a>
            </div>
          ) : (
            <div className="py-2">
              {items.map(item => (
                <CartItemComponent
                  key={productKey(item)}
                  item={item}
                  itemKey={productKey(item)}
                  onRemove={removeFromCart}
                  onUpdateQty={updateQty}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-border flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-inter font-semibold text-text">Total</span>
              <span className="font-inter font-bold text-2xl text-text">S/ {total.toFixed(2)}</span>
            </div>
            <a
              href="/checkout"
              className="w-full py-4 bg-[#0D0D0D] text-[#F8F8F5] font-inter font-medium text-sm rounded hover:bg-[#1A1A1A] transition-colors text-center block"
              aria-label="Ir al checkout"
            >
              Ir al checkout
            </a>
            <a
              href="/carrito"
              className="text-center text-sm font-inter text-text-muted hover:text-text transition-colors"
              aria-label="Ver carrito completo"
            >
              Ver carrito completo
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
