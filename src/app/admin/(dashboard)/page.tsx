import Link from "next/link";
import { db } from "@/lib/db";
import { formatLKR } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [productCount, publishedCount, orderStats, recentOrders, customerCount] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { published: true } }),
    db.order.groupBy({
      by: ["status"],
      _count: { _all: true },
      _sum: { total: true },
    }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.user.count({ where: { role: "customer" } }),
  ]);

  const totalOrders = orderStats.reduce((s, g) => s + g._count._all, 0);
  const paidRevenue = orderStats
    .filter((g) => g.status === "paid")
    .reduce((s, g) => s + (g._sum.total ?? 0), 0);
  const pendingCount = orderStats.find((g) => g.status === "pending")?._count._all ?? 0;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-5xl md:text-6xl">DASHBOARD</h1>
        <p className="text-muted text-sm uppercase tracking-[0.15em] mt-2">
          Lifting Social Foods · Today
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat label="Total Revenue" value={formatLKR(paidRevenue)} accent />
        <Stat label="Orders" value={String(totalOrders)} />
        <Stat label="Pending" value={String(pendingCount)} />
        <Stat label="Customers" value={String(customerCount)} />
        <Stat
          label="Products"
          value={`${publishedCount}/${productCount}`}
          sub="published"
        />
      </section>

      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="font-display text-3xl">RECENT ORDERS</h2>
          <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-[0.1em] hover:text-accent">
            View All →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="border border-border bg-surface p-8 text-center text-muted">
            No orders yet. They&apos;ll appear here after the first checkout.
          </div>
        ) : (
          <div className="border border-border bg-surface divide-y divide-border">
            {recentOrders.map((o) => (
              <Link
                key={o.id}
                href={`/admin/orders/${o.id}`}
                className="flex items-center justify-between p-4 hover:bg-background transition-colors"
              >
                <div>
                  <div className="font-mono text-xs text-muted">{o.orderRef}</div>
                  <div className="font-bold">{o.customerName}</div>
                  <div className="text-xs text-muted">{o.customerEmail}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl">{formatLKR(o.total)}</div>
                  <StatusBadge status={o.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/products/new"
          className="border border-border bg-surface p-6 hover:border-accent transition-colors block"
        >
          <div className="font-display text-2xl mb-1">+ NEW PRODUCT</div>
          <p className="text-sm text-muted">Add a meal with macros, photo, and ingredients.</p>
        </Link>
        <Link
          href="/admin/products"
          className="border border-border bg-surface p-6 hover:border-accent transition-colors block"
        >
          <div className="font-display text-2xl mb-1">MANAGE MENU</div>
          <p className="text-sm text-muted">Edit pricing, toggle visibility, reorder.</p>
        </Link>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="border border-border bg-surface p-5">
      <div className="text-[10px] uppercase tracking-[0.15em] text-muted">{label}</div>
      <div className={`font-display text-3xl md:text-4xl mt-2 ${accent ? "text-accent" : ""}`}>
        {value}
      </div>
      {sub && <div className="text-[10px] uppercase tracking-[0.15em] text-muted mt-1">{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-foreground text-background border-foreground",
    pending: "text-foreground border-foreground",
    failed: "text-muted border-muted line-through",
    cancelled: "text-muted border-muted line-through",
    chargedback: "text-muted border-muted line-through",
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
