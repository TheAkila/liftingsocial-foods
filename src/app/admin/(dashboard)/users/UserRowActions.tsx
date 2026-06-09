"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteUser } from "./actions";

export function UserRowActions({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!confirm(`Remove ${name} from the team?`)) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteUser(id);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1 shrink-0">
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="text-[10px] font-bold uppercase tracking-[0.15em] border border-border px-2 py-1 hover:border-accent hover:text-accent disabled:opacity-50"
      >
        Remove
      </button>
      {error && <span className="text-[10px] text-accent">{error}</span>}
    </div>
  );
}
