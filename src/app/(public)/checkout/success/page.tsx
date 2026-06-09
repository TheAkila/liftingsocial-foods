import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

type Search = Promise<{ order?: string }>;

export default async function SuccessPage({ searchParams }: { searchParams: Search }) {
  const { order } = await searchParams;
  return (
    <section className="container-x py-24 md:py-32 text-center max-w-2xl">
      <div className="font-display text-accent text-6xl mb-4">✓</div>
      <h1 className="font-display text-5xl md:text-6xl leading-[0.9] mb-4">
        ORDER LOCKED IN.
      </h1>
      <p className="text-foreground/80 text-lg mb-2">
        Thanks for fueling up with GymDine.
      </p>
      {order && (
        <p className="text-sm text-muted mb-8">
          Order ID:{" "}
          <span className="font-mono text-foreground">{order}</span>
        </p>
      )}
      <p className="text-foreground/75 mb-10 max-w-md mx-auto">
        We&apos;ll send a confirmation email with your delivery slot. Questions? Reply to that
        email or hit us up on WhatsApp.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/menu" className="btn-primary text-sm">
          Order Again →
        </Link>
        <Link href="/" className="btn-ghost text-sm">
          Back Home
        </Link>
      </div>
    </section>
  );
}
