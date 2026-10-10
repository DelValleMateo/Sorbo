"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { EMPTY_FORM, type OrderForm } from "@/lib/order";
import type { CartMap } from "@/types";

interface CartState {
  items: CartMap;
  /** Datos de entrega y pago: se recuerdan para el próximo pedido (igual que el diseño). */
  form: OrderForm;
  add: (id: string, qty?: number) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  setForm: <K extends keyof OrderForm>(key: K, value: OrderForm[K]) => void;
}

/**
 * Carrito persistido en localStorage. `skipHydration` evita diferencias entre
 * el HTML del servidor y el cliente: se rehidrata en <StoreHydrator />.
 */
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      form: EMPTY_FORM,
      add: (id, qty = 1) =>
        set((s) => ({ items: { ...s.items, [id]: (s.items[id] ?? 0) + qty } })),
      dec: (id) =>
        set((s) => {
          const items = { ...s.items };
          items[id] = (items[id] ?? 0) - 1;
          if (items[id] <= 0) delete items[id];
          return { items };
        }),
      remove: (id) =>
        set((s) => {
          const items = { ...s.items };
          delete items[id];
          return { items };
        }),
      clear: () => set({ items: {} }),
      setForm: (key, value) => set((s) => ({ form: { ...s.form, [key]: value } })),
    }),
    {
      name: "sorbo-cart-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, form: s.form }),
      skipHydration: true,
    },
  ),
);

export const selectCount = (s: CartState) =>
  Object.values(s.items).reduce((a, b) => a + b, 0);
