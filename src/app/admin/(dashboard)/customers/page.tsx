import Link from "next/link";
import { db } from "@/lib/db";
import { formatLKR } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await db.user.findMany({
    where: { role: "customer" },
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        select: { total: true, status: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-5xl">CUSTOMERS</h1>
        <p className="text-muted text-sm mt-1">
          {customers.length} customer{customers.length === 1 ? "" : "s"} (Google sign-in)
        </p>
      </header>

      {customers.length === 0 ? (
        <div className="border border-border bg-surface p-10 text-center text-muted">
          No customers yet. They&apos;ll appear here after their first Google sign-in.
        </div>
      ) : (
        <div className="border border-border bg-surface divide-y divide-border">
          {customers.map((c) => {
            const paid = c.orders.filter((o) => o.status === "paid");
            const ltv = paid.reduce((s, o) => s + o.total, 0);
            const initial = (c.name ?? c.email).charAt(0).toUpperCase();
            return (
              <Link
                key={c.id}
                href={`/admin/customers/${c.id}`}
                className="flex items-center gap-4 p-4 hover:bg-background transition-colors"
              >
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.image}
                    alt=""
                    className="w-10 h-10 rounded-full shrink-0 border border-border"
                  />
                ) : (
                  <div className="w-10 h-10 shrink-0 bg-foreground text-background flex items-center justify-center font-display text-lg rounded-full">
                    {initial}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{c.name ?? c.email}</div>
                  <div className="text-sm text-muted truncate">{c.email}</div>
                </div>
                <div className="text-right text-sm shrink-0">
                  <div className="text-muted text-[10px] uppercase tracking-[0.15em]">
                    {c.orders.length} order{c.orders.length === 1 ? "" : "s"}
                  </div>
                  <div className="font-display text-xl">{formatLKR(ltv)}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
