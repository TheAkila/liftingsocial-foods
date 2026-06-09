import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatLKR } from "@/lib/products";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/menu/${product.slug}`}
      className="group block bg-surface border border-border hover:border-accent transition-colors"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <ProductImage name={product.name} category={product.category} image={product.image} />
        {product.badge && (
          <span className="absolute top-3 left-3 chip chip-accent bg-background/80 backdrop-blur">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-display text-2xl leading-tight group-hover:text-accent transition-colors">
            {product.name.toUpperCase()}
          </h3>
          <span className="font-bold text-lg shrink-0">{formatLKR(product.price)}</span>
        </div>
        <p className="text-sm text-muted mb-4 line-clamp-2">{product.tagline}</p>
        <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-border">
          <Macro label="Protein" value={`${product.protein}g`} />
          <Macro label="Cals" value={`${product.calories}`} />
          <Macro label="Carbs" value={`${product.carbs}g`} />
        </div>
      </div>
    </Link>
  );
}

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-xl text-foreground">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.15em] text-muted">{label}</div>
    </div>
  );
}
