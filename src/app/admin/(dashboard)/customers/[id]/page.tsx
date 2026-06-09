import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatLKR } from "@/lib/products";

type Params = Promise<{ id: string }>;

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const customer = await db.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
    },
  });

  if (!customer || customer.role !== "customer") notFound();

  const paid = customer.orders.filter((o) => o.status === "paid");
  const ltv = paid.reduce((s, o) => s + o.total, 0);
  const initial = (customer.name ?? customer.email).charAt(0).toUpperCase();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Link
          href="/admin/customers"
          className="text-xs uppercase tracking-[0.15em] text-muted hover:text-accent"
        >
          ← Customers
        </Link>
      </div>

      <header className="flex items-center gap-5 flex-wrap">
        {customer.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={customer.image}
            alt=""
            className="w-20 h-20 rounded-full border border-border"
          />
        ) : (
          <div className="w-20 h-20 bg-foreground text-background flex items-center justify-center font-display text-3xl rounded-full">
            {initial}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-4xl md:text-5xl">{customer.name ?? "Customer"}</h1>
          <p className="text-muted">{customer.email}</p>
          {customer.phone && <p className="text-muted text-sm mt-1">{customer.phone}</p>}
        </div>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Total Spent" value={formatLKR(ltv)} accent />
        <Stat label="Orders" value={String(customer.orders.length)} />
        <Stat label="Paid Orders" value={String(paid.length)} />
        <Stat
          label="Joined"
          value={customer.createdAt.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "2-digit",
          })}
        />
      </section>

      <section>
        <h2 className="font-display text-2xl mb-4">ORDERS</h2>
        {customer.orders.length === 0 ? (
          <div className="border border-border bg-surface p-8 text-center text-muted">
            No orders from this customer yet.
          </div>
        ) : (
          <div className="border border-border bg-surface divide-y divide-border">
            {customer.orders.map((o) => (
              <Link
                key={o.id}
                href={`/admin/orders/${o.id}`}
                className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] items-center gap-3 p-4 hover:bg-background transition-colors"
              >
                <div>
                  <div className="font-mono text-xs text-muted">{o.orderRef}</div>
                  <div className="text-sm text-foreground/85">
                    {o.items.length} item{o.items.length === 1 ? "" : "s"}
                  </div>
                  <div className="text-xs text-muted">
                    {o.createdAt.toLocaleDateString("en-GB")}{" "}
                    {o.createdAt.toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="font-display text-xl md:text-right">{formatLKR(o.total)}</div>
                <StatusBadge status={o.status} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="border border-border bg-surface p-4">
      <div className="text-[10px] uppercase tracking-[0.15em] text-muted">{label}</div>
      <div className={`font-display text-2xl mt-1 ${accent ? "text-accent" : ""}`}>{value}</div>
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
      className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] border w-fit ${
        map[status] ?? "text-muted border-border"
      }`}
    >
      {status}
    </span>
  );
}
