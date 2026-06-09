import type { Metadata } from "next";
import { getProducts, type ProductCategory } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { MenuFilter } from "./MenuFilter";

export const metadata: Metadata = {
  title: "Menu — Protein Meals Built for Lifters",
  description:
    "Browse our full menu of chef-crafted, macro-tracked protein meals. Dinner, lunch, breakfast and snacks.",
};

const VALID: ProductCategory[] = ["dinner", "lunch", "breakfast", "snack"];

type Search = Promise<{ category?: string }>;

export default async function MenuPage({ searchParams }: { searchParams: Search }) {
  const { category } = await searchParams;
  const cat = VALID.includes(category as ProductCategory)
    ? (category as ProductCategory)
    : undefined;
  const products = await getProducts({ category: cat });

  return (
    <>
      <section className="border-b border-border">
        <div className="container-x py-16 md:py-20">
          <span className="chip mb-4">THE MENU</span>
          <h1 className="font-display text-6xl md:text-7xl leading-[0.9] mb-4">
            BUILT FOR<br />
            <span className="text-accent">THE LIFT.</span>
          </h1>
          <p className="text-foreground/80 max-w-2xl text-sm md:text-lg leading-relaxed">
            Every meal is chef-cooked, macro-tracked, and packed to keep its protein count honest.
            Pick what fuels your week.
          </p>
        </div>
      </section>

      <section className="border-b border-border sticky top-20 z-30 bg-background/95 backdrop-blur">
        <div className="container-x">
          <MenuFilter active={cat} />
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          {products.length === 0 ? (
            <p className="text-muted text-center py-20">No meals in this category yet.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {products.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
