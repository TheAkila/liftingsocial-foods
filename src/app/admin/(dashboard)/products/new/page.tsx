import Link from "next/link";
import { ProductForm } from "../ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="text-xs uppercase tracking-[0.15em] text-muted hover:text-accent"
        >
          ← Products
        </Link>
        <h1 className="font-display text-5xl mt-2">NEW PRODUCT</h1>
      </div>
      <ProductForm />
    </div>
  );
}
