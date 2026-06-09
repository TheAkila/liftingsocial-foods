import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/checkout");

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
