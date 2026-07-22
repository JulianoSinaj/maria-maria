"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCTS, FREE_SHIPPING_FROM, SHIPPING_COST } from "./shopData";

/* Client-side cart for the shop page — quantities keyed by product id,
   persisted to localStorage after hydration so a visit survives reloads. */

const STORAGE_KEY = "mm-cart-v1";
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ id, qty }]
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((i) => PRODUCTS[i?.id] && Number.isInteger(i?.qty) && i.qty > 0));
        }
      }
    } catch {
      /* corrupted storage — start empty */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — cart stays in memory */
    }
  }, [items, hydrated]);

  const add = useCallback((id, qty = 1) => {
    if (!PRODUCTS[id]) return;
    setItems((prev) => {
      const found = prev.find((i) => i.id === id);
      if (found) return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { id, qty }];
    });
  }, []);

  const decrement = useCallback((id) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const qtyOf = useCallback((id) => items.find((i) => i.id === id)?.qty ?? 0, [items]);

  const value = useMemo(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + PRODUCTS[i.id].price * i.qty, 0);
    const shipping = subtotal > 0 && subtotal < FREE_SHIPPING_FROM ? SHIPPING_COST : 0;
    return {
      items,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      freeShippingFrom: FREE_SHIPPING_FROM,
      missingForFreeShipping: Math.max(0, FREE_SHIPPING_FROM - subtotal),
      add,
      decrement,
      remove,
      clear,
      qtyOf,
      open,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
    };
  }, [items, open, add, decrement, remove, clear, qtyOf]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
