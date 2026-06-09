"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { CartButton } from "./CartButton";
import { CartDrawer } from "./CartDrawer";
import { signOutAction } from "@/app/actions/auth";

const nav = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/contact", label: "Contact" },
];

export type HeaderUser = {
  name: string | null;
  email: string | null;
  image: string | null;
} | null;

export function Header({ user }: { user: HeaderUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
        <div className="container-x flex items-center justify-between h-20">
          <Logo size="lg" />
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
            <UserMenu user={user} />
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
              <div className="hairline my-2" />
              {user ? (
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-base font-bold uppercase tracking-[0.1em] text-foreground/80 hover:text-accent"
                >
                  My Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-base font-bold uppercase tracking-[0.1em] text-foreground/80 hover:text-accent"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
      <CartDrawer />
    </>
  );
}

function UserMenu({ user }: { user: HeaderUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onClick);
      return () => document.removeEventListener("mousedown", onClick);
    }
  }, [open]);

  if (!user) {
    return (
      <Link
        href="/login"
        className="hidden md:inline-flex text-xs font-bold uppercase tracking-[0.1em] text-foreground/80 hover:text-accent"
      >
        Sign In
      </Link>
    );
  }

  const initial = (user.name ?? user.email ?? "?").charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 p-1 hover:opacity-80"
        aria-label="Account menu"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt=""
            className="w-8 h-8 rounded-full border border-border"
          />
        ) : (
          <span className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">
            {initial}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border shadow-lg z-50">
          <div className="px-4 py-3 border-b border-border">
            <div className="text-sm font-bold truncate">{user.name ?? "Customer"}</div>
            <div className="text-xs text-muted truncate">{user.email}</div>
          </div>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm font-bold uppercase tracking-[0.1em] hover:bg-surface"
          >
            My Account
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full text-left px-4 py-2.5 text-sm font-bold uppercase tracking-[0.1em] hover:bg-surface text-muted"
            >
              Sign Out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
