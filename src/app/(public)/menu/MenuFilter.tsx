"use client";

import Link from "next/link";

const filters = [
  { value: undefined, label: "All" },
  { value: "dinner", label: "Dinner" },
  { value: "lunch", label: "Lunch" },
  { value: "breakfast", label: "Breakfast" },
  { value: "snack", label: "Snacks" },
];

export function MenuFilter({ active }: { active?: string }) {
  return (
    <div className="flex gap-1 overflow-x-auto py-3">
      {filters.map((f) => {
        const isActive = f.value === active || (!f.value && !active);
        const href = f.value ? `/menu?category=${f.value}` : "/menu";
        return (
          <Link
            key={f.label}
            href={href}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] whitespace-nowrap border transition-colors ${
              isActive
                ? "bg-accent text-background border-accent"
                : "border-border text-foreground/80 hover:border-foreground"
            }`}
          >
            {f.label}
          </Link>
        );
      })}
    </div>
  );
}
