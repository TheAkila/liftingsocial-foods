"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./products";

export type CartLine = {
  slug: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  add: (product: Product, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      add: (product, qty = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.slug === product.slug);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.slug === product.slug ? { ...l, quantity: l.quantity + qty } : l
              ),
              isOpen: true,
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity: qty,
              },
            ],
            isOpen: true,
          };
        }),
      remove: (slug) =>
        set((state) => ({ lines: state.lines.filter((l) => l.slug !== slug) })),
      setQty: (slug, qty) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (l.slug === slug ? { ...l, quantity: Math.max(0, qty) } : l))
            .filter((l) => l.quantity > 0),
        })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: "ls-foods-cart",
      partialize: (state) => ({ lines: state.lines }),
    }
  )
);

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}
