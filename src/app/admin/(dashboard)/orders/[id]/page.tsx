import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatLKR } from "@/lib/products";
import { OrderStatusSelector } from "./OrderStatusSelector";

type Params = Promise<{ id: string }>;

export default async function OrderDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link
          href="/admin/orders"
          className="text-xs uppercase tracking-[0.15em] text-muted hover:text-accent"
        >
          ← Orders
        </Link>
        <div className="flex items-end justify-between flex-wrap gap-4 mt-2">
          <div>
            <h1 className="font-display text-5xl">ORDER</h1>
            <p className="font-mono text-sm text-muted mt-1">{order.orderRef}</p>
          </div>
          <OrderStatusSelector orderId={order.id} current={order.status} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="CUSTOMER">
          <Line label="Name" value={order.customerName} />
          <Line label="Email" value={order.customerEmail} />
          <Line label="Phone" value={order.customerPhone} />
        </Card>
        <Card title="DELIVERY">
          <Line label="Address" value={order.address} />
          <Line label="City" value={order.city} />
          {order.notes && <Line label="Notes" value={order.notes} />}
        </Card>
      </div>

      <Card title="ITEMS">
        <div className="divide-y divide-border -mx-5">
          {order.items.map((it) => (
            <div key={it.id} className="flex justify-between items-center px-5 py-3">
              <div>
                <div className="font-bold">{it.productName}</div>
                <div className="text-xs text-muted">
                  /{it.productSlug} · {it.quantity} × {formatLKR(it.price)}
                </div>
              </div>
              <div className="font-bold">{formatLKR(it.price * it.quantity)}</div>
            </div>
          ))}
        </div>
        <div className="hairline -mx-5" />
        <div className="space-y-1 text-sm">
          <Row label="Subtotal" value={formatLKR(order.subtotal)} />
          <Row label="Delivery" value={formatLKR(order.deliveryFee)} />
          <Row label="Total" value={formatLKR(order.total)} bold />
        </div>
      </Card>

      <Card title="PAYMENT">
        <Line label="Method" value={order.paymentMethod} />
        <Line label="Status" value={order.status} />
        {order.payhereStatus && <Line label="PayHere status code" value={order.payhereStatus} />}
        {order.payherePaymentId && (
          <Line label="PayHere payment ID" value={order.payherePaymentId} mono />
        )}
        <Line
          label="Placed"
          value={`${order.createdAt.toLocaleDateString("en-GB")} ${order.createdAt.toLocaleTimeString("en-GB")}`}
        />
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-surface p-5 space-y-3">
      <h3 className="font-display text-xl">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Line({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.15em] text-muted">{label}</div>
      <div className={`text-sm ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-bold text-base" : ""}`}>
      <span className={bold ? "" : "text-muted"}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
