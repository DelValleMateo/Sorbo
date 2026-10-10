"use client";

import { create } from "zustand";

interface UiState {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  /** Mensaje para la región aria-live. */
  message: string;
  announce: (message: string) => void;
}

export const useUi = create<UiState>((set) => ({
  cartOpen: false,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  message: "",
  announce: (message) => {
    // Vaciar primero para que un mensaje repetido se vuelva a anunciar.
    set({ message: "" });
    setTimeout(() => set({ message }), 60);
  },
}));
