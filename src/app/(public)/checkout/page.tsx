import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getShopStatus } from "@/lib/site-config";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/checkout");

  const shop = await getShopStatus();

  if (!shop.isOpen) {
    return (
      <section className="container-x py-16 md:py-24 max-w-xl">
        <h1 className="font-display text-5xl md:text-6xl mb-4">SHOP CLOSED</h1>
        <p className="text-muted mb-8 leading-relaxed">{shop.closedMessage}</p>
        <p className="text-sm text-muted mb-8">
          Your cart is saved. Come back when we&apos;re open and check out then.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/menu" className="btn-ghost text-sm">
            Browse Menu
          </Link>
          <Link href="/" className="btn-primary text-sm">
            Back Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-x py-12 md:py-16">
      <h1 className="font-display text-5xl md:text-6xl mb-2">CHECKOUT</h1>
      <p className="text-muted mb-10">Delivery info and payment via PayHere.</p>
      <CheckoutForm
        defaultName={session.user.name ?? ""}
        defaultEmail={session.user.email ?? ""}
      />
    </section>
  );
}
