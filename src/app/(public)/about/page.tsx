import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Born From the Barbell",
  description: "Lifting Social Foods is the kitchen arm of Lifting Social — built by lifters for lifters.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="container-x py-20 md:py-28 max-w-4xl">
          <span className="chip mb-4">OUR STORY</span>
          <h1 className="font-display text-6xl md:text-8xl leading-[0.85]">
            BORN FROM THE<br /><span className="text-accent">BARBELL.</span>
          </h1>
          <p className="text-xl text-foreground/80 mt-8 max-w-2xl leading-relaxed">
            Lifting Social Foods is the kitchen arm of the Lifting Social brand — Sri Lanka&apos;s
            home for weightlifting culture. We started cooking because the lifters in our community
            kept asking the same question: &ldquo;Where do I get clean food that actually hits my
            macros?&rdquo;
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid md:grid-cols-2 gap-12 max-w-5xl">
          <div className="space-y-4">
            <h2 className="font-display text-4xl">THE PROBLEM</h2>
            <p className="text-foreground/80 leading-relaxed">
              Most &ldquo;healthy&rdquo; meal services skim on protein, hide oil, and dress up rice
              as a power bowl. Lifters need transparent macros and real portions — not Instagram
              food.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="font-display text-4xl">THE FIX</h2>
            <p className="text-foreground/80 leading-relaxed">
              Every Lifting Social meal is built around a target protein number, cooked clean in a
              commercial kitchen, labeled to the gram, and delivered cold. No guessing.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-surface border-y border-border">
        <div className="container-x max-w-4xl">
          <h2 className="font-display text-5xl md:text-6xl mb-10">WHAT WE STAND FOR</h2>
          <div className="grid gap-8">
            <Value
              n="01"
              title="Macros Are Sacred"
              body="If the label says 50g of protein, the meal has 50g of protein. Period."
            />
            <Value
              n="02"
              title="Real Food Wins"
              body="Whole grains, fresh produce, properly-sourced meat. No protein powders hiding in your dinner."
            />
            <Value
              n="03"
              title="Built for Strength"
              body="Our portions assume you train. Hard. The menu reflects that."
            />
            <Value
              n="04"
              title="Local First"
              body="Sri Lankan ingredients, Sri Lankan chefs, Sri Lankan lifters."
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x text-center max-w-2xl">
          <h2 className="font-display text-5xl mb-4">
            TRAIN HARD. <span className="text-accent">EAT HARDER.</span>
          </h2>
          <p className="text-foreground/80 mb-8">Start with a meal that hits your numbers.</p>
          <Link href="/menu" className="btn-primary text-sm">
            See the Menu →
          </Link>
        </div>
      </section>
    </>
  );
}

function Value({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-6 border-l-2 border-accent pl-6">
      <div className="font-display text-3xl text-accent">{n}</div>
      <div>
        <h3 className="font-display text-2xl mb-1">{title.toUpperCase()}</h3>
        <p className="text-foreground/75 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
