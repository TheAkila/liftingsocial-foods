import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Born From the Barbell",
  description: "GymDine — built by lifters, for lifters.",
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
          <p className="text-sm md:text-xl text-foreground/80 mt-8 max-w-2xl leading-relaxed">
            GymDine is Sri Lanka&apos;s protein meal kitchen for serious lifters. We started cooking
            because every lifter we knew kept asking the same question: &ldquo;Where do I get clean
            food that actually hits my macros?&rdquo;
          </p>
          <p className="text-sm md:text-base text-foreground/70 mt-4 max-w-2xl leading-relaxed">
            Founded by{" "}
            <span className="text-foreground font-semibold">Akila Nishan</span> and{" "}
            <span className="text-foreground font-semibold">Kasun Sanjana</span>, two young
            weightlifters turned entrepreneurs.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid md:grid-cols-2 gap-12 max-w-5xl">
          <div className="space-y-4">
            <h2 className="font-display text-4xl">THE PROBLEM</h2>
            <p className="text-foreground/80 leading-relaxed">
              Most &ldquo;healthy&rdquo; meal services skim on protein, hide oil, and dress up rice
              as a power bowl. Lifters need transparent macros and real portions not Instagram
              food.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="font-display text-4xl">THE FIX</h2>
            <p className="text-foreground/80 leading-relaxed">
              Every GymDine meal is built around a target protein number, cooked clean in a
              commercial kitchen, labeled to the gram, and delivered ready to eat. No guessing.
            </p>
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-x max-w-5xl">
          <div className="flex items-end justify-between gap-6 mb-14 md:mb-20">
            <div>
              <span className="chip mb-4">THE FOUNDERS</span>
              <h2 className="font-display text-5xl md:text-6xl leading-[0.9]">
                TWO LIFTERS.<br />
                <span className="text-accent">ONE KITCHEN.</span>
              </h2>
            </div>
            <span className="hidden md:block text-xs font-bold tracking-[0.2em] text-muted uppercase pb-2">
              Est. 2026 · Sri Lanka
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-12 md:gap-16">
            <Founder
              index="01"
              src="/founder-akila.jpg"
              name="Akila Nishan"
              role="Co-founder"
              bio="Computer Science graduate from the University of Colombo with eight years on the Olympic weightlifting platform. Co-founded GymDine on a simple thesis: Sri Lanka's serious lifters deserve food engineered to the standard they train at."
            />
            <Founder
              index="02"
              src="/founder-kasun.jpg"
              name="Kasun Sanjana"
              role="Co-founder"
              bio="Physical Science graduate from the University of Ruhuna who went from first lift to the Olympic weightlifting platform in under two years. Brings that same execution speed to GymDine, a kitchen that treats fuel as seriously as the people earning it."
            />
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

function Founder({
  index,
  src,
  name,
  role,
  bio,
}: {
  index: string;
  src: string;
  name: string;
  role: string;
  bio: string;
}) {
  return (
    <div className="group">
      <div className="relative aspect-4/5 w-full max-w-65 bg-surface-2 overflow-hidden">
        <Image
          src={src}
          alt={name}
          fill
          sizes="260px"
          className="object-cover"
        />
        <span className="absolute top-0 left-0 bg-foreground text-background font-display text-base px-2.5 py-1 leading-none flex items-center">
          {index}
        </span>
      </div>
      <div className="mt-6">
        <div className="flex items-center gap-3 mb-3">
          <span aria-hidden className="block h-px w-8 bg-foreground" />
          <span className="text-[0.65rem] font-bold tracking-[0.22em] text-foreground/70 uppercase">
            {role}
          </span>
        </div>
        <h3 className="font-display text-3xl md:text-4xl leading-[0.95]">{name.toUpperCase()}</h3>
        <p className="mt-5 text-sm md:text-base text-foreground/75 leading-relaxed">{bio}</p>
      </div>
    </div>
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
