import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../lib/cart-store.js';
import CartDrawer from './CartDrawer.js';

interface HeaderCartProps {
  isCustomer: boolean;
  loginHref: string;
}

export default function HeaderCart({ isCustomer, loginHref }: HeaderCartProps) {
  const { count } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (!isCustomer) {
      window.location.assign(loginHref);
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="relative flex h-10 w-10 items-center justify-center text-text transition-colors hover:text-text-muted"
        aria-label="Ver carrito de compras"
      >
        <ShoppingBag size={20} aria-hidden="true" />
        {count > 0 && (
          <span
            className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0D0D0D] px-1 font-inter text-[10px] font-bold text-accent"
            aria-label={`${count} items en carrito`}
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>
      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
