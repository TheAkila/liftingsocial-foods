"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart, cartSubtotal } from "@/lib/cart";
import { formatLKR } from "@/lib/products";

const DELIVERY_FEE = 350;

export function CheckoutForm() {
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const subtotal = cartSubtotal(lines);
  const total = subtotal + (lines.length ? DELIVERY_FEE : 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (lines.length === 0) return;
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/payhere/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            slug: l.slug,
            name: l.name,
            price: l.price,
            quantity: l.quantity,
          })),
          customer: {
            firstName: String(form.get("firstName") ?? ""),
            lastName: String(form.get("lastName") ?? ""),
            email: String(form.get("email") ?? ""),
            phone: String(form.get("phone") ?? ""),
            address: String(form.get("address") ?? ""),
            city: String(form.get("city") ?? ""),
            notes: String(form.get("notes") ?? ""),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");

      const phForm = document.createElement("form");
      phForm.method = "POST";
      phForm.action = data.checkoutUrl;
      for (const [k, v] of Object.entries(data.payload)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = String(v);
        phForm.appendChild(input);
      }
      document.body.appendChild(phForm);
      clear();
      phForm.submit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  if (mounted && lines.length === 0) {
    return (
      <div className="border border-border bg-surface p-10 text-center">
        <p className="text-muted mb-4">Your cart is empty.</p>
        <Link href="/menu" className="btn-primary text-sm">
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1.4fr_1fr] gap-10">
      <div className="space-y-8">
        <Section title="DELIVERY DETAILS">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field name="firstName" label="First Name" required />
            <Field name="lastName" label="Last Name" required />
          </div>
          <Field name="email" label="Email" type="email" required />
          <Field name="phone" label="Phone" type="tel" required placeholder="+94 77 000 0000" />
          <Field name="address" label="Street Address" required />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field name="city" label="City" required defaultValue="Colombo" />
            <Field name="country" label="Country" defaultValue="Sri Lanka" disabled />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-muted mb-2">
              Delivery Notes (optional)
            </label>
            <textarea
              name="notes"
              rows={3}
              className="w-full bg-background border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
              placeholder="Gate code, drop-off instructions, etc."
            />
          </div>
        </Section>
      </div>

      <aside className="space-y-4">
        <div className="border border-border bg-surface p-6 sticky top-24 space-y-4">
          <h3 className="font-display text-2xl">ORDER SUMMARY</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {mounted &&
              lines.map((l) => (
                <div key={l.slug} className="flex justify-between text-sm">
                  <span className="text-foreground/85">
                    <span className="text-muted">{l.quantity}× </span>
                    {l.name}
                  </span>
                  <span className="font-bold">{formatLKR(l.price * l.quantity)}</span>
                </div>
              ))}
          </div>
          <div className="hairline" />
          <div className="space-y-2 text-sm">
            <Row label="Subtotal" value={formatLKR(subtotal)} />
            <Row label="Delivery" value={formatLKR(lines.length ? DELIVERY_FEE : 0)} />
          </div>
          <div className="hairline" />
          <div className="flex justify-between items-baseline">
            <span className="text-xs uppercase tracking-[0.15em] text-muted">Total</span>
            <span className="font-display text-3xl text-accent">{formatLKR(total)}</span>
          </div>

          {error && (
            <div className="text-sm text-accent border border-accent/40 bg-accent/5 px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || lines.length === 0}
            className="btn-primary w-full text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Redirecting…" : "Pay with PayHere →"}
          </button>
          <p className="text-[11px] text-muted text-center leading-relaxed">
            You&apos;ll be redirected to PayHere to complete payment securely. Card, UPI, and Sri
            Lankan bank options supported.
          </p>
        </div>
      </aside>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-surface p-6 space-y-4">
      <h3 className="font-display text-2xl">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  defaultValue,
  disabled,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs uppercase tracking-[0.15em] text-muted mb-2">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full bg-background border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none disabled:opacity-60"
      />
    </div>
  );
}
