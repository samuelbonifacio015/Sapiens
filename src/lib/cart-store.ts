import { useState, useEffect, useCallback } from 'react';
import type { Libro, Revista, CartItem } from '../types/index.js';

const STORAGE_KEY = 'sapiens_cart';

interface CartUpdateDetail {
  count: number;
  items: CartItem[];
}

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

function getProductStock(item: CartItem | Libro | Revista): number {
  const stock = 'producto' in item ? item.producto.stock : item.stock;
  return Number.isFinite(stock) ? Math.max(0, stock) : 0;
}

function dispatchCartUpdate(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  const count = items.reduce((sum, item) => sum + item.cantidad, 0);
  window.dispatchEvent(new CustomEvent<CartUpdateDetail>('cart-update', { detail: { count, items } }));
}

export function getCartSnapshot() {
  const items = readStorage();
  const total = items.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);
  const count = items.reduce((sum, item) => sum + item.cantidad, 0);
  return { items, total, count };
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readStorage());

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    };
    const onCartUpdate = () => setItems(readStorage());
    window.addEventListener('storage', onStorage);
    window.addEventListener('cart-update', onCartUpdate);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('cart-update', onCartUpdate);
    };
  }, []);

  const syncedSet = useCallback((next: CartItem[]) => {
    setItems(next);
    writeStorage(next);
    dispatchCartUpdate(next);
  }, []);

  const addToCart = useCallback(
    (producto: Libro | Revista, tipo: 'libro' | 'revista', qty = 1) => {
      setItems(prev => {
        const key = tipo === 'libro'
          ? `libro-${(producto as Libro).id_libro}`
          : `revista-${(producto as Revista).id_revista}`;
        const existing = prev.find(i => productKey(i) === key);
        const stock = getProductStock(producto);
        if (stock < 1) return prev;
        const safeQty = Math.max(1, qty);
        const currentQty = existing?.cantidad ?? 0;
        const nextQty = Math.min(stock, currentQty + safeQty);
        const next = existing
          ? prev.map(i => productKey(i) === key ? { ...i, cantidad: nextQty, producto } : i)
          : [...prev, { producto, tipo, cantidad: Math.min(stock, safeQty) }];
        writeStorage(next);
        dispatchCartUpdate(next);
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
        dispatchCartUpdate(next);
        return next;
      });
    },
    []
  );

  const updateQty = useCallback(
    (key: string, cantidad: number) => {
      setItems(prev => {
        const next = prev.map(i => {
          if (productKey(i) !== key) return i;
          const stock = getProductStock(i);
          return { ...i, cantidad: Math.min(stock, Math.max(1, cantidad)) };
        });
        writeStorage(next);
        dispatchCartUpdate(next);
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
