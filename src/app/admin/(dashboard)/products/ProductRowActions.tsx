"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { deleteProduct, toggleProductPublished } from "./actions";

export function ProductRowActions({
  id,
  slug,
  published,
  name,
}: {
  id: string;
  slug: string;
  published: boolean;
  name: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleProductPublished(id, !published);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteProduct(id);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        type="button"
        onClick={handleToggle}
        disabled={pending}
        className="text-[10px] font-bold uppercase tracking-[0.15em] border border-border px-2 py-1 hover:border-foreground disabled:opacity-50"
        title={published ? "Hide from public menu" : "Publish to public menu"}
      >
        {published ? "Unpublish" : "Publish"}
      </button>
      <Link
        href={`/admin/products/${id}`}
        className="text-[10px] font-bold uppercase tracking-[0.15em] border border-border px-2 py-1 hover:border-accent hover:text-accent"
      >
        Edit
      </Link>
      <Link
        href={`/menu/${slug}`}
        target="_blank"
        className="text-[10px] font-bold uppercase tracking-[0.15em] border border-border px-2 py-1 hover:border-foreground"
      >
        View
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="text-[10px] font-bold uppercase tracking-[0.15em] border border-border px-2 py-1 hover:border-accent hover:text-accent disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
