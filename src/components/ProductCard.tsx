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
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 chip chip-accent bg-background/80 backdrop-blur text-[9px] sm:text-xs">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-3 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-3 mb-1 sm:mb-2">
          <h3 className="font-display text-lg sm:text-2xl leading-tight group-hover:text-accent transition-colors">
            {product.name.toUpperCase()}
          </h3>
          <span className="font-bold text-sm sm:text-lg shrink-0">
            {formatLKR(product.price)}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted mb-3 sm:mb-4 line-clamp-2">
          {product.tagline}
        </p>
        <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center pt-3 sm:pt-4 border-t border-border">
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
      <div className="font-display text-base sm:text-xl text-foreground">{value}</div>
      <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-muted">
        {label}
      </div>
    </div>
  );
}
