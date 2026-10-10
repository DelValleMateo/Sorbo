"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

/** Rehidrata el carrito desde localStorage una vez montado el cliente. */
export function StoreHydrator() {
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);
  return null;
}
