"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

export function AddToCart({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);

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
