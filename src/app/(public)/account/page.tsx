import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { formatLKR } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account");

  const [user, orders] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, image: true, phone: true, createdAt: true },
    }),
    db.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
  ]);

  if (!user) redirect("/login");

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="container-x py-12 md:py-16 space-y-10">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name ?? user.email}
              className="w-14 h-14 rounded-full border border-border"
            />
          ) : (
            <div className="w-14 h-14 bg-foreground text-background flex items-center justify-center font-display text-2xl rounded-full">
              {(user.name ?? user.email).charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="font-display text-3xl md:text-4xl">{user.name ?? "Welcome"}</h1>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
        </div>
        <form action={logout}>
          <button type="submit" className="btn-ghost text-sm">
            Sign Out
          </button>
        </form>
      </header>

      <section>
        <h2 className="font-display text-2xl mb-4">ORDER HISTORY</h2>
        {orders.length === 0 ? (
          <div className="border border-border bg-surface p-10 text-center">
            <p className="text-muted mb-4">No orders yet — fuel up.</p>
            <Link href="/menu" className="btn-primary text-sm">
              Browse the Menu →
            </Link>
          </div>
        ) : (
          <div className="border border-border bg-surface divide-y divide-border">
            {orders.map((o) => (
              <div key={o.id} className="p-5 space-y-3">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div>
                    <div className="font-mono text-xs text-muted">{o.orderRef}</div>
                    <div className="text-sm text-muted">
                      {o.createdAt.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl">{formatLKR(o.total)}</div>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
                <ul className="text-sm text-foreground/85">
                  {o.items.map((it) => (
                    <li key={it.id}>
                      <span className="text-muted">{it.quantity}× </span>
                      {it.productName}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
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
      className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] border ${
        map[status] ?? "text-muted border-border"
      }`}
    >
      {status}
    </span>
  );
}
