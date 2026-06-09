import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getProducts, getProduct, formatLKR } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { AddToCart } from "./AddToCart";

// Render on-demand so builds don't require a reachable database.
export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  try {
    const rows = await db.product.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return rows.map((p) => ({ slug: p.slug }));
  } catch {
    // DB not reachable at build time (e.g. CI without DATABASE_URL).
    // Pages will be rendered on-demand instead of prerendered.
    return [];
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Meal not found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product || !product.published) notFound();

  const all = await getProducts();
  const related = all.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <div className="container-x py-6 text-xs uppercase tracking-[0.15em] text-muted">
        <Link href="/menu" className="hover:text-accent">
          ← Back to menu
        </Link>
      </div>

      <section className="container-x pb-16 grid lg:grid-cols-2 gap-12">
        <div className="aspect-square lg:aspect-[4/5] bg-surface border border-border">
          <ProductImage name={product.name} category={product.category} image={product.image} />
        </div>

        <div className="space-y-6">
          {product.badge && <span className="chip chip-accent">{product.badge}</span>}
          <h1 className="font-display text-5xl md:text-6xl leading-[0.9]">
            {product.name.toUpperCase()}
          </h1>
          <p className="text-xl text-foreground/80">{product.tagline}</p>
          <div className="font-display text-4xl text-accent">{formatLKR(product.price)}</div>

          <div className="hairline" />

          <p className="text-foreground/85 leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
            <Macro value={`${product.protein}g`} label="Protein" highlight />
            <Macro value={`${product.calories}`} label="Calories" />
            <Macro value={`${product.carbs}g`} label="Carbs" />
            <Macro value={`${product.fats}g`} label="Fats" />
          </div>

          <div className="hairline" />

          <AddToCart product={product} />

          <div>
            <h3 className="font-display text-xl mb-3">INGREDIENTS</h3>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((i) => (
                <span key={i} className="chip">
                  {i}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border p-4 text-sm text-muted leading-relaxed">
            <strong className="text-foreground uppercase tracking-[0.15em] text-xs block mb-1">
              Storage
            </strong>
            Delivered ready to eat. Refrigerate if not eating immediately and reheat within 24
            hours — microwave 2 minutes or oven 8 minutes at 180°C.
          </div>
        </div>
      </section>

      <section className="section border-t border-border bg-surface">
        <div className="container-x">
          <h2 className="font-display text-4xl mb-8">YOU MIGHT ALSO LIKE</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Macro({
  value,
  label,
  highlight,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border p-3 text-center ${
        highlight ? "border-accent bg-accent/5" : "border-border bg-surface"
      }`}
    >
      <div className={`font-display text-2xl ${highlight ? "text-accent" : "text-foreground"}`}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-[0.15em] text-muted mt-1">{label}</div>
    </div>
  );
}
