"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { SessionPayload } from "@/lib/auth";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "▣" },
  { href: "/admin/products", label: "Products", icon: "▤" },
  { href: "/admin/orders", label: "Orders", icon: "▥" },
  { href: "/admin/customers", label: "Customers", icon: "◯" },
  { href: "/admin/users", label: "Team", icon: "◉" },
];

export function AdminShell({
  session,
  children,
}: {
  session: SessionPayload;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between border-b border-border px-4 h-14">
        <Link href="/admin" className="font-display text-lg">
          GYMDINE<span className="text-accent">.</span>ADMIN
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="p-2 -mr-2"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
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
      </header>

      {/* Sidebar */}
      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:block w-full md:w-60 md:min-h-screen border-r border-border bg-surface md:sticky md:top-0 md:self-start`}
      >
        <div className="hidden md:block p-6 border-b border-border">
          <Link href="/admin" className="font-display text-2xl">
            GYMDINE<span className="text-accent">.</span>ADMIN
          </Link>
          <div className="text-[10px] uppercase tracking-[0.15em] text-muted mt-1">
            Operator Console
          </div>
        </div>
        <nav className="p-3 md:p-4 space-y-1">
          {nav.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-bold uppercase tracking-[0.1em] transition-colors ${
                  active
                    ? "bg-accent text-background"
                    : "text-foreground/70 hover:text-foreground hover:bg-background"
                }`}
              >
                <span className="text-base opacity-70">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border md:mt-8">
          <div className="text-[10px] uppercase tracking-[0.15em] text-muted">Signed in as</div>
          <div className="text-sm font-bold truncate">{session.email}</div>
          <div className="text-[10px] uppercase tracking-[0.15em] text-muted mt-0.5">
            {session.role}
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-3 w-full text-xs font-bold uppercase tracking-[0.1em] border border-border px-3 py-2 hover:border-accent hover:text-accent transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="p-6 md:p-10 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
