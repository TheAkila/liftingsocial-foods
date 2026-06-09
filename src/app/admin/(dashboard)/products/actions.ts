"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/products";

const CATEGORIES = ["dinner", "lunch", "breakfast", "snack"] as const;
type Category = (typeof CATEGORIES)[number];

export type ProductFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
} | null;

function asInt(v: FormDataEntryValue | null, field: string, errs: Record<string, string>): number {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) {
    errs[field] = "Must be a non-negative number";
    return 0;
  }
  return Math.floor(n);
}

function parseForm(form: FormData) {
  const errs: Record<string, string> = {};

  const name = String(form.get("name") ?? "").trim();
  if (!name) errs.name = "Name is required";

  const tagline = String(form.get("tagline") ?? "").trim();
  if (!tagline) errs.tagline = "Tagline is required";

  const description = String(form.get("description") ?? "").trim();
  if (!description) errs.description = "Description is required";

  let slug = String(form.get("slug") ?? "").trim();
  if (!slug && name) slug = slugify(name);
  if (!slug) errs.slug = "Slug is required";
  else if (!/^[a-z0-9-]+$/.test(slug)) errs.slug = "Use lowercase letters, numbers, and hyphens only";

  const category = String(form.get("category") ?? "") as Category;
  if (!CATEGORIES.includes(category)) errs.category = "Pick a valid category";

  const price = asInt(form.get("price"), "price", errs);
  const protein = asInt(form.get("protein"), "protein", errs);
  const calories = asInt(form.get("calories"), "calories", errs);
  const carbs = asInt(form.get("carbs"), "carbs", errs);
  const fats = asInt(form.get("fats"), "fats", errs);
  const sortOrder = asInt(form.get("sortOrder"), "sortOrder", errs);

  const ingredients = String(form.get("ingredients") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
  if (!ingredients) errs.ingredients = "At least one ingredient";

  const badge = String(form.get("badge") ?? "").trim() || null;
  const imageRaw = String(form.get("image") ?? "").trim();
  const image = imageRaw || null;
  const published = form.get("published") === "on";

  return {
    errs,
    data: {
      slug,
      name,
      tagline,
      description,
      price,
      protein,
      calories,
      carbs,
      fats,
      category,
      image,
      badge,
      ingredients,
      published,
      sortOrder,
    },
  };
}

export async function createProduct(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const { errs, data } = parseForm(formData);
  if (Object.keys(errs).length > 0) {
    return { error: "Fix the highlighted fields.", fieldErrors: errs };
  }

  const existing = await db.product.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return { error: "Slug already taken.", fieldErrors: { slug: "Already exists" } };
  }

  await db.product.create({ data });
  revalidatePath("/admin/products");
  revalidatePath("/menu");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const { errs, data } = parseForm(formData);
  if (Object.keys(errs).length > 0) {
    return { error: "Fix the highlighted fields.", fieldErrors: errs };
  }

  const existing = await db.product.findFirst({
    where: { slug: data.slug, NOT: { id } },
  });
  if (existing) {
    return { error: "Slug already taken.", fieldErrors: { slug: "Already exists" } };
  }

  await db.product.update({ where: { id }, data });
  revalidatePath("/admin/products");
  revalidatePath(`/menu/${data.slug}`);
  revalidatePath("/menu");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  await db.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/menu");
  revalidatePath("/");
}

export async function toggleProductPublished(id: string, published: boolean) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  await db.product.update({ where: { id }, data: { published } });
  revalidatePath("/admin/products");
  revalidatePath("/menu");
  revalidatePath("/");
}
