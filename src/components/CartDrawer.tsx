"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart, cartSubtotal } from "@/lib/cart";
import { formatLKR } from "@/lib/products";
import { ProductImage } from "./ProductImage";

export function CartDrawer() {
  const { isOpen, close, lines, setQty, remove } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  const subtotal = cartSubtotal(lines);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={isOpen ? "false" : "true"}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-black/60 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-background border-l border-border flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display text-2xl">YOUR CART</h2>
          <button onClick={close} aria-label="Close cart" className="p-2 text-muted hover:text-foreground">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-4">
            <p className="text-muted">Your cart is empty.</p>
            <Link href="/menu" onClick={close} className="btn-primary text-sm">
              Browse the menu
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {lines.map((line) => {
                return (
                  <div key={line.slug} className="p-4 flex gap-4">
                    <div className="w-20 h-20 shrink-0 bg-surface overflow-hidden">
                      <ProductImage
                        name={line.name}
                        category={line.category}
                        image={line.image}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-3">
                        <Link
                          href={`/menu/${line.slug}`}
                          onClick={close}
                          className="font-bold uppercase tracking-wide text-sm hover:text-accent truncate"
                        >
                          {line.name}
                        </Link>
                        <button
                          onClick={() => remove(line.slug)}
                          className="text-muted hover:text-accent text-xs"
                          aria-label={`Remove ${line.name}`}
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-muted text-sm mt-1">{formatLKR(line.price)}</p>
                      <div className="mt-2 inline-flex items-center border border-border">
                        <button
                          onClick={() => setQty(line.slug, line.quantity - 1)}
                          className="w-8 h-8 text-foreground hover:text-accent"
                          aria-label="Decrease"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{line.quantity}</span>
                        <button
                          onClick={() => setQty(line.slug, line.quantity + 1)}
                          className="w-8 h-8 text-foreground hover:text-accent"
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border p-5 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-[0.15em] text-muted">Subtotal</span>
                <span className="font-display text-3xl text-accent">{formatLKR(subtotal)}</span>
              </div>
              <p className="text-xs text-muted">Shipping calculated at checkout.</p>
              <Link href="/checkout" onClick={close} className="btn-primary w-full text-sm">
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
