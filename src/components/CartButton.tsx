"use client";

import { useEffect, useState } from "react";
import { useCart, cartCount } from "@/lib/cart";

export function CartButton() {
  const lines = useCart((s) => s.lines);
  const toggle = useCart((s) => s.toggle);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = mounted ? cartCount(lines) : 0;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Open cart"
      className="relative p-2 -mr-2 text-foreground hover:text-accent transition-colors"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M3 5h2l2.4 11.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="21" r="1.4" />
        <circle cx="18" cy="21" r="1.4" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-accent text-background text-[10px] font-bold flex items-center justify-center rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}
