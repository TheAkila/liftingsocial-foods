import Link from "next/link";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

// Render on-demand so the build doesn't require a reachable database.
// On Vercel with DATABASE_URL set, each request hits the DB directly (fast on Neon's pooled connection).
export const dynamic = "force-dynamic";

export default async function Home() {
  const all = await getProducts();
  const featured = all.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(60% 80% at 80% 20%, rgba(10,10,10,0.05) 0%, transparent 60%), radial-gradient(50% 70% at 10% 90%, rgba(10,10,10,0.03) 0%, transparent 60%)",
          }}
        />
        <div className="container-x relative pt-8 pb-12 md:pt-12 md:pb-24 grid md:grid-cols-12 gap-8 md:gap-10 items-center">
          <div className="md:col-span-7 space-y-7">
            <span className="chip chip-accent">FUEL FOR CHAMPIONS</span>
            <h1 className="font-display text-glow text-[clamp(2.75rem,11vw,8rem)] leading-[0.85]">
              EAT LIKE<br />YOU <span className="text-accent">TRAIN.</span>
            </h1>
            <p className="text-sm md:text-xl text-foreground/80 max-w-xl leading-relaxed">
              Chef-crafted, ready-to-eat protein meals. Macro-tracked to the gram. Delivered
              across Sri Lanka — so you spend less time meal-prepping and more time under the bar.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/menu" className="btn-primary text-sm">
                Shop the Menu →
              </Link>
              <Link href="/how-it-works" className="btn-ghost text-sm">
                How It Works
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 text-xs uppercase tracking-[0.15em] text-muted">
              <span>✓ 30g+ Protein</span>
              <span>✓ Zero Fillers</span>
              <span>✓ Ready to Eat</span>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {featured.slice(0, 2).map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-b border-border bg-surface">
        <div className="container-x py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <Stat value="40g+" label="Avg. Protein per Meal" />
          <Stat value="100%" label="Real Whole Foods" />
          <Stat value="48h" label="Fresh Delivery Window" />
          <Stat value="0" label="Artificial Fillers" />
        </div>
      </section>

      {/* FEATURED MEALS */}
      <section className="section">
        <div className="container-x">
          <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
            <div>
              <span className="chip mb-3">THIS WEEK</span>
              <h2 className="font-display text-5xl md:text-6xl">SIGNATURE MEALS</h2>
            </div>
            <Link href="/menu" className="text-sm font-bold uppercase tracking-[0.1em] hover:text-accent">
              View Full Menu →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="section bg-surface border-y border-border">
        <div className="container-x grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <span className="chip mb-3">THE MANIFESTO</span>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.9]">
              ENGINEERED<br />
              FOR <span className="text-accent">PERFORMANCE.</span>
            </h2>
          </div>
          <div className="md:col-span-7 space-y-5 md:space-y-6 text-foreground/85 text-sm md:text-lg leading-relaxed">
            <p>
              You don&apos;t skip sets. So why settle for meals that skip on protein? Every GymDine
              meal is built around one rule: deliver real, whole-food macros that fuel real lifting.
            </p>
            <p>
              No mystery sauces. No filler grains. Just chicken, fish, lean beef, rice, and
              vegetables — cooked clean, portioned hard, and labeled with the numbers that matter.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 pt-4">
              <Pillar n="01" title="Macro-Tracked" body="Every meal carries protein, carb, and fat counts on the label." />
              <Pillar n="02" title="Chef-Crafted" body="Built in a commercial kitchen by chefs who lift." />
              <Pillar n="03" title="Heat & Eat" body="Pre-cooked, sealed, and ready to eat. Just heat and dig in." />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-x">
          <div className="relative overflow-hidden border border-border p-12 md:p-20 text-center">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(50% 80% at 50% 50%, rgba(10,10,10,0.05) 0%, transparent 70%)",
              }}
            />
            <div className="relative space-y-6">
              <h2 className="font-display text-5xl md:text-7xl">
                READY TO <span className="text-accent">FUEL UP?</span>
              </h2>
              <p className="text-foreground/80 max-w-lg mx-auto">
                Pick your meals. Pick your delivery day. We do the rest.
              </p>
              <Link href="/menu" className="btn-primary text-sm">
                Build Your Order →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-4xl md:text-5xl text-accent">{value}</div>
      <div className="text-[11px] uppercase tracking-[0.15em] text-muted mt-1">{label}</div>
    </div>
  );
}

function Pillar({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="border-l-2 border-accent pl-4">
      <div className="text-xs text-accent font-bold mb-1">{n}</div>
      <div className="font-display text-xl mb-1">{title.toUpperCase()}</div>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </div>
  );
}
