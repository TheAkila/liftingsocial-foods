"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { slugify } from "@/lib/products";
import { ProductImage } from "@/components/ProductImage";
import { createProduct, updateProduct, type ProductFormState } from "./actions";

type Props = {
  product?: Product;
};

export function ProductForm({ product }: Props) {
  const isEdit = !!product;
  const action = isEdit
    ? updateProduct.bind(null, product.id)
    : createProduct;

  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(
    action,
    null
  );

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!product);
  const [imageUrl, setImageUrl] = useState<string | null>(product?.image ?? null);
  const [category, setCategory] = useState<string>(product?.category ?? "dinner");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function handleNameChange(v: string) {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  async function handleFile(file: File) {
    setUploading(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setImageUrl(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const errs = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="grid lg:grid-cols-[1fr_360px] gap-8">
      <input type="hidden" name="image" value={imageUrl ?? ""} />

      <div className="space-y-6">
        <Card title="BASICS">
          <Field
            label="Name"
            name="name"
            required
            defaultValue={product?.name}
            error={errs.name}
            onChange={handleNameChange}
            value={name}
          />
          <Field
            label="Slug (URL path)"
            name="slug"
            required
            value={slug}
            onChange={(v) => {
              setSlug(v);
              setSlugTouched(true);
            }}
            help="e.g. champion-chicken-rice → /menu/champion-chicken-rice"
            error={errs.slug}
          />
          <Field
            label="Tagline (one-line hook)"
            name="tagline"
            required
            defaultValue={product?.tagline}
            error={errs.tagline}
            placeholder="The classic. Engineered for gains."
          />
          <Textarea
            label="Description"
            name="description"
            required
            rows={4}
            defaultValue={product?.description}
            error={errs.description}
          />
        </Card>

        <Card title="MACROS">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field
              label="Protein (g)"
              name="protein"
              type="number"
              required
              defaultValue={product?.protein ?? 0}
              error={errs.protein}
            />
            <Field
              label="Calories"
              name="calories"
              type="number"
              required
              defaultValue={product?.calories ?? 0}
              error={errs.calories}
            />
            <Field
              label="Carbs (g)"
              name="carbs"
              type="number"
              required
              defaultValue={product?.carbs ?? 0}
              error={errs.carbs}
            />
            <Field
              label="Fats (g)"
              name="fats"
              type="number"
              required
              defaultValue={product?.fats ?? 0}
              error={errs.fats}
            />
          </div>
        </Card>

        <Card title="INGREDIENTS">
          <Textarea
            label="Comma-separated"
            name="ingredients"
            required
            rows={3}
            defaultValue={product?.ingredients.join(", ")}
            error={errs.ingredients}
            placeholder="Chicken breast, Basmati rice, Bell peppers, Garlic"
          />
        </Card>
      </div>

      <aside className="space-y-6">
        <Card title="IMAGE">
          <div className="aspect-square bg-background border border-border overflow-hidden">
            <ProductImage name={name || "Meal"} category={category} image={imageUrl} />
          </div>
          <label className="block">
            <span className="block text-xs uppercase tracking-[0.15em] text-muted mb-2">
              Upload (JPEG/PNG/WebP, max 8MB)
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
              className="block w-full text-xs file:mr-3 file:py-2 file:px-3 file:border-0 file:bg-accent file:text-background file:font-bold file:uppercase file:tracking-wider file:cursor-pointer"
            />
          </label>
          {uploading && <p className="text-xs text-muted">Uploading…</p>}
          {uploadError && <p className="text-xs text-accent">{uploadError}</p>}
          {imageUrl && (
            <button
              type="button"
              onClick={() => setImageUrl(null)}
              className="text-xs text-muted hover:text-accent underline"
            >
              Remove image (use placeholder)
            </button>
          )}
        </Card>

        <Card title="DISPLAY">
          <Select
            label="Category"
            name="category"
            value={category}
            onChange={setCategory}
            error={errs.category}
            options={[
              { value: "dinner", label: "Dinner" },
              { value: "lunch", label: "Lunch" },
              { value: "breakfast", label: "Breakfast" },
              { value: "snack", label: "Snack" },
            ]}
          />
          <Field
            label="Price (LKR)"
            name="price"
            type="number"
            required
            defaultValue={product?.price ?? 0}
            error={errs.price}
          />
          <Field
            label="Badge (optional)"
            name="badge"
            defaultValue={product?.badge ?? ""}
            placeholder="Bestseller, Low Carb, etc."
          />
          <Field
            label="Sort order"
            name="sortOrder"
            type="number"
            defaultValue={product?.sortOrder ?? 100}
            help="Lower = shown first"
          />
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              defaultChecked={product?.published ?? true}
              className="w-4 h-4 accent-[var(--accent)]"
            />
            <span className="text-sm font-bold uppercase tracking-[0.1em]">
              Published (visible on menu)
            </span>
          </label>
        </Card>

        {state?.error && (
          <div className="text-sm text-accent border border-accent/40 bg-accent/5 px-3 py-2">
            {state.error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending || uploading}
            className="btn-primary flex-1 text-sm disabled:opacity-60"
          >
            {pending ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
          </button>
          <Link href="/admin/products" className="btn-ghost text-sm">
            Cancel
          </Link>
        </div>
      </aside>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-surface p-5 space-y-4">
      <h3 className="font-display text-xl">{title}</h3>
      {children}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  value,
  onChange,
  error,
  help,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  value?: string;
  onChange?: (v: string) => void;
  error?: string;
  help?: string;
  placeholder?: string;
}) {
  const controlled = value !== undefined;
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.15em] text-muted mb-2" htmlFor={name}>
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={controlled ? undefined : defaultValue}
        value={controlled ? value : undefined}
        onChange={controlled && onChange ? (e) => onChange(e.target.value) : undefined}
        className={`w-full bg-background border px-3 py-2 text-sm focus:outline-none ${
          error ? "border-accent" : "border-border focus:border-accent"
        }`}
      />
      {error && <p className="text-xs text-accent mt-1">{error}</p>}
      {help && !error && <p className="text-xs text-muted mt-1">{help}</p>}
    </div>
  );
}

function Textarea({
  label,
  name,
  required,
  defaultValue,
  error,
  rows = 3,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  error?: string;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.15em] text-muted mb-2" htmlFor={name}>
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`w-full bg-background border px-3 py-2 text-sm focus:outline-none ${
          error ? "border-accent" : "border-border focus:border-accent"
        }`}
      />
      {error && <p className="text-xs text-accent mt-1">{error}</p>}
    </div>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.15em] text-muted mb-2" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-background border px-3 py-2 text-sm focus:outline-none ${
          error ? "border-accent" : "border-border focus:border-accent"
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-accent mt-1">{error}</p>}
    </div>
  );
}
