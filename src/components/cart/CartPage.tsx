import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../lib/cart-store.js';
import CartItemComponent from './CartItem.js';
import CartSummary from './CartSummary.js';

export default function CartPage() {
  const { items, total, removeFromCart, updateQty, productKey } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-6">
        <ShoppingBag size={64} className="text-border mb-6" aria-hidden="true" />
        <h2 className="font-playfair font-bold text-2xl text-text mb-2">Tu carrito está vacío</h2>
        <p className="font-inter text-text-muted text-base mb-8">Agrega libros o revistas para comenzar.</p>
        <a
          href="/catalogo"
          className="px-8 py-4 bg-[#0D0D0D] text-[#F8F8F5] font-inter font-medium text-sm rounded hover:bg-[#1A1A1A] transition-colors"
          aria-label="Explorar el catálogo"
        >
          Explorar catálogo
        </a>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
      {/* Items list */}
      <div>
        <h2 className="font-playfair font-bold text-2xl text-text mb-6">
          Tu carrito <span className="font-inter text-base text-text-muted font-normal">({items.length} {items.length === 1 ? 'producto' : 'productos'})</span>
        </h2>
        <div>
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
      </div>

      {/* Summary */}
      <CartSummary subtotal={total} />
    </div>
  );
}
