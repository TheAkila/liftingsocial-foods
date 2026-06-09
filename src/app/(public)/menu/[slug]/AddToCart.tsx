"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

type Props = {
  product: Product;
  shopOpen: boolean;
};

export function AddToCart({ product, shopOpen }: Props) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);

  if (!shopOpen) {
    return (
      <button
        type="button"
        disabled
        className="w-full bg-surface-2 text-muted border border-border py-3.5 px-5 text-sm font-bold uppercase tracking-[0.04em] cursor-not-allowed"
      >
        Shop Closed — Orders Paused
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="inline-flex items-center border border-border">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="w-12 h-12 text-foreground hover:text-accent text-lg"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-12 text-center font-bold">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          className="w-12 h-12 text-foreground hover:text-accent text-lg"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => add(product, qty)}
        className="btn-primary flex-1 text-sm"
      >
        Add to Cart →
      </button>
    </div>
  );
}
