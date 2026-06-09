import type { Metadata } from "next";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <section className="container-x py-12 md:py-16">
      <h1 className="font-display text-5xl md:text-6xl mb-2">CHECKOUT</h1>
      <p className="text-muted mb-10">Delivery info and payment via PayHere.</p>
      <CheckoutForm />
    </section>
  );
}
