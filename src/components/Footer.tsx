import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-x py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <Logo size="lg" />
          <p className="text-muted max-w-sm">
            Chef-crafted, ready-to-eat protein meals built for lifters. Macro-tracked, no
            fillers, delivered across Sri Lanka.
          </p>
          <p className="text-xs uppercase tracking-[0.15em] text-muted">
            Made in Sri Lanka · Fuel for lifters
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg mb-4">SHOP</h4>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li>
              <Link href="/menu" className="hover:text-accent">
                Full Menu
              </Link>
            </li>
            <li>
              <Link href="/menu?category=dinner" className="hover:text-accent">
                Dinner Meals
              </Link>
            </li>
            <li>
              <Link href="/menu?category=breakfast" className="hover:text-accent">
                Breakfast
              </Link>
            </li>
            <li>
              <Link href="/menu?category=snack" className="hover:text-accent">
                Snacks
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-4">COMPANY</h4>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li>
              <Link href="/about" className="hover:text-accent">
                About
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="hover:text-accent">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-accent">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="hairline" />
      <div className="container-x py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted">
        <span>© {new Date().getFullYear()} GymDine. All rights reserved.</span>
        <span className="uppercase tracking-[0.15em]">Built for Champions</span>
      </div>
    </footer>
  );
}
