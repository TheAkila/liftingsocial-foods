import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works",
  description: "From order to delivery — here's how GymDine gets to your kitchen.",
};

const steps = [
  {
    n: "01",
    title: "BUILD YOUR ORDER",
    body: "Browse the menu and add the meals you want. Mix and match across dinner, lunch, breakfast and snacks.",
  },
  {
    n: "02",
    title: "PICK YOUR DELIVERY",
    body: "Choose a delivery slot during checkout. We deliver across Colombo, Kandy & Galle, with island-wide expansion coming soon.",
  },
  {
    n: "03",
    title: "WE COOK FRESH",
    body: "Our kitchen preps your meals on the morning of delivery — never frozen, never reheated.",
  },
  {
    n: "04",
    title: "DELIVERED TO YOUR DOOR",
    body: "Meals arrive sealed and ready to eat. Enjoy fresh, or refrigerate and reheat within 24 hours.",
  },
  {
    n: "05",
    title: "HEAT. EAT. LIFT.",
    body: "2 minutes in the microwave or 8 minutes in the oven at 180°C. Macros stay honest.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="container-x py-20 md:py-28 max-w-4xl">
          <span className="chip mb-4">HOW IT WORKS</span>
          <h1 className="font-display text-6xl md:text-8xl leading-[0.85]">
            FROM <span className="text-accent">KITCHEN</span><br />
            TO BARBELL.
          </h1>
          <p className="text-xl text-foreground/80 mt-8 max-w-2xl">
            Five steps from order to gains.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-x max-w-4xl space-y-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 border border-border p-6 md:p-8 bg-surface"
            >
              <div className="font-display text-5xl md:text-6xl text-accent leading-none">{s.n}</div>
              <div>
                <h3 className="font-display text-2xl md:text-3xl mb-2">{s.title}</h3>
                <p className="text-foreground/80 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section border-t border-border bg-surface">
        <div className="container-x text-center max-w-2xl">
          <h2 className="font-display text-5xl mb-4">
            READY? <span className="text-accent">LET&apos;S EAT.</span>
          </h2>
          <Link href="/menu" className="btn-primary text-sm">
            Start Your Order →
          </Link>
        </div>
      </section>
    </>
  );
}
