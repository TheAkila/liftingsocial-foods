import Link from "next/link";
import { getAllProductsForAdmin, formatLKR } from "@/lib/products";
import { ProductImage } from "@/components/ProductImage";
import { ProductRowActions } from "./ProductRowActions";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="font-display text-5xl">PRODUCTS</h1>
          <p className="text-muted text-sm mt-1">
            {products.length} total · {products.filter((p) => p.published).length} published
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-sm">
          + New Product
        </Link>
      </header>

      {products.length === 0 ? (
        <div className="border border-border bg-surface p-10 text-center">
          <p className="text-muted mb-4">No products yet.</p>
          <Link href="/admin/products/new" className="btn-primary text-sm">
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="border border-border bg-surface divide-y divide-border">
          {products.map((p) => (
            <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-16 h-16 shrink-0 bg-background border border-border overflow-hidden">
                  <ProductImage name={p.name} category={p.category} image={p.image} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="font-bold hover:text-accent truncate"
                    >
                      {p.name}
                    </Link>
                    {!p.published && (
                      <span className="text-[10px] uppercase tracking-[0.15em] text-muted border border-border px-1.5 py-0.5">
                        draft
                      </span>
                    )}
                    {p.badge && (
                      <span className="text-[10px] uppercase tracking-[0.15em] text-accent border border-accent/40 px-1.5 py-0.5">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted truncate mt-0.5">
                    /{p.slug} · {p.category} · {p.protein}g protein · {p.calories} cal
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                <div className="font-display text-xl">{formatLKR(p.price)}</div>
                <ProductRowActions id={p.id} slug={p.slug} published={p.published} name={p.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
