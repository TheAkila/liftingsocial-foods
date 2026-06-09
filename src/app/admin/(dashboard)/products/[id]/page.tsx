import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlugOrId } from "@/lib/products";
import { ProductForm } from "../ProductForm";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const product = await getProductBySlugOrId(id);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="text-xs uppercase tracking-[0.15em] text-muted hover:text-accent"
        >
          ← Products
        </Link>
        <h1 className="font-display text-5xl mt-2">EDIT PRODUCT</h1>
        <p className="text-muted text-sm mt-1">
          /menu/<span className="text-foreground">{product.slug}</span>
        </p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
