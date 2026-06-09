"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { CartButton } from "./CartButton";
import { CartDrawer } from "./CartDrawer";

const nav = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
        <div className="container-x flex items-center justify-between h-16">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-[0.1em]">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground/80 hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <CartButton />
            <button
              type="button"
              aria-label="Toggle menu"
              className="md:hidden p-2 -mr-2 text-foreground"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {mobileOpen ? (
                  <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                ) : (
                  <>
                    <path d="M3 6h18" strokeLinecap="round" />
                    <path d="M3 12h18" strokeLinecap="round" />
                    <path d="M3 18h18" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container-x py-4 flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-base font-bold uppercase tracking-[0.1em] text-foreground/80 hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
      <CartDrawer />
    </>
  );
}
