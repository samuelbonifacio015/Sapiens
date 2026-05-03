import { useState, useEffect, useCallback } from 'react';
import type { Libro, Revista, CartItem } from '../types/index.js';

const STORAGE_KEY = 'sapiens_cart';

function readStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

function productKey(item: CartItem): string {
  return item.tipo === 'libro'
    ? `libro-${(item.producto as Libro).id_libro}`
    : `revista-${(item.producto as Revista).id_revista}`;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readStorage());

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const syncedSet = useCallback((next: CartItem[]) => {
    setItems(next);
    writeStorage(next);
    window.dispatchEvent(new Event('cart-update'));
  }, []);

  const addToCart = useCallback(
    (producto: Libro | Revista, tipo: 'libro' | 'revista', qty = 1) => {
      setItems(prev => {
        const key = tipo === 'libro'
          ? `libro-${(producto as Libro).id_libro}`
          : `revista-${(producto as Revista).id_revista}`;
        const existing = prev.find(i => productKey(i) === key);
        const next = existing
          ? prev.map(i => productKey(i) === key ? { ...i, cantidad: i.cantidad + qty } : i)
          : [...prev, { producto, tipo, cantidad: qty }];
        writeStorage(next);
        window.dispatchEvent(new Event('cart-update'));
        return next;
      });
    },
    []
  );

  const removeFromCart = useCallback(
    (key: string) => {
      setItems(prev => {
        const next = prev.filter(i => productKey(i) !== key);
        writeStorage(next);
        window.dispatchEvent(new Event('cart-update'));
        return next;
      });
    },
    []
  );

  const updateQty = useCallback(
    (key: string, cantidad: number) => {
      if (cantidad < 1) return;
      setItems(prev => {
        const next = prev.map(i => productKey(i) === key ? { ...i, cantidad } : i);
        writeStorage(next);
        window.dispatchEvent(new Event('cart-update'));
        return next;
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    syncedSet([]);
  }, [syncedSet]);

  const total = items.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0);
  const count = items.reduce((sum, i) => sum + i.cantidad, 0);

  return { items, total, count, addToCart, removeFromCart, updateQty, clearCart, productKey };
}
