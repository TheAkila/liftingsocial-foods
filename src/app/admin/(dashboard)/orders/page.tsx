import Link from "next/link";
import { db } from "@/lib/db";
import { formatLKR } from "@/lib/products";

export const dynamic = "force-dynamic";

type Search = Promise<{ status?: string }>;

const STATUS_FILTERS = [
  { value: undefined, label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

export default async function OrdersPage({ searchParams }: { searchParams: Search }) {
  const { status } = await searchParams;
  const orders = await db.order.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-5xl">ORDERS</h1>
        <p className="text-muted text-sm mt-1">{orders.length} shown</p>
      </header>

      <div className="flex gap-1 overflow-x-auto">
        {STATUS_FILTERS.map((f) => {
          const active = f.value === status || (!f.value && !status);
          const href = f.value ? `/admin/orders?status=${f.value}` : "/admin/orders";
          return (
            <Link
              key={f.label}
              href={href}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] border ${
                active
                  ? "bg-accent text-background border-accent"
                  : "border-border text-foreground/70 hover:border-foreground"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="border border-border bg-surface p-10 text-center text-muted">
          No orders match this filter.
        </div>
      ) : (
        <div className="border border-border bg-surface divide-y divide-border">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id}`}
              className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] items-center gap-4 p-4 hover:bg-background"
            >
              <div>
                <div className="font-mono text-xs text-muted">{o.orderRef}</div>
                <div className="font-bold">{o.customerName}</div>
                <div className="text-xs text-muted truncate">
                  {o.items.length} item{o.items.length === 1 ? "" : "s"} · {o.city}
                </div>
              </div>
              <div className="text-xs text-muted">
                {o.createdAt.toLocaleDateString("en-GB")}{" "}
                {o.createdAt.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="font-display text-2xl text-right">{formatLKR(o.total)}</div>
              <StatusBadge status={o.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "text-success border-success/40",
    pending: "text-muted border-border",
    failed: "text-accent border-accent/40",
    cancelled: "text-muted border-border",
    chargedback: "text-accent border-accent/40",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] border ${
        map[status] ?? "text-muted border-border"
      }`}
    >
      {status}
    </span>
  );
}
