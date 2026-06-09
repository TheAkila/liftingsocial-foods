"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "../actions";

const STATUSES = ["pending", "paid", "failed", "cancelled", "chargedback"];

export function OrderStatusSelector({
  orderId,
  current,
}: {
  orderId: string;
  current: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    startTransition(async () => {
      await updateOrderStatus(orderId, next);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs uppercase tracking-[0.15em] text-muted">Status</label>
      <select
        value={current}
        onChange={handleChange}
        disabled={pending}
        className="bg-surface border border-border px-3 py-2 text-sm font-bold uppercase tracking-[0.1em] focus:border-accent focus:outline-none disabled:opacity-60"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
