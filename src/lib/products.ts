import { db } from "./db";

export type ProductCategory = "dinner" | "lunch" | "breakfast" | "snack";

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  protein: number;
  calories: number;
  carbs: number;
  fats: number;
  category: ProductCategory;
  image: string | null;
  badge: string | null;
  ingredients: string[];
  published: boolean;
  sortOrder: number;
};

type DbProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  protein: number;
  calories: number;
  carbs: number;
  fats: number;
  category: string;
  image: string | null;
  badge: string | null;
  ingredients: string;
  published: boolean;
  sortOrder: number;
};

function fromDb(p: DbProduct): Product {
  return {
    ...p,
    category: p.category as ProductCategory,
    ingredients: p.ingredients
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean),
  };
}

export async function getProducts(opts?: {
  category?: ProductCategory;
  publishedOnly?: boolean;
}): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: {
      ...(opts?.category ? { category: opts.category } : {}),
      ...(opts?.publishedOnly !== false ? { published: true } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(fromDb);
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  const rows = await db.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(fromDb);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const row = await db.product.findUnique({ where: { slug } });
  return row ? fromDb(row) : null;
}

export async function getProductBySlugOrId(idOrSlug: string): Promise<Product | null> {
  const row =
    (await db.product.findUnique({ where: { id: idOrSlug } })) ??
    (await db.product.findUnique({ where: { slug: idOrSlug } }));
  return row ? fromDb(row) : null;
}

export function formatLKR(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-LK")}`;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
