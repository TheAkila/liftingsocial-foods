import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { getShopStatus } from "@/lib/site-config";
import { buildCheckoutHash, PAYHERE_CHECKOUT_URL } from "@/lib/payhere";

type CartLineIn = {
  slug: string;
  name: string;
  price: number;
  quantity: number;
};

type Body = {
  lines: CartLineIn[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
};

const DELIVERY_FEE = 350;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to place an order." }, { status: 401 });
  }

  const shop = await getShopStatus();
  if (!shop.isOpen) {
    return NextResponse.json(
      { error: shop.closedMessage || "Shop is currently closed." },
      { status: 403 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.lines?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Re-fetch prices server-side so the client can't tamper with totals
  const slugs = body.lines.map((l) => l.slug);
  const products = await db.product.findMany({ where: { slug: { in: slugs } } });
  const priceMap = new Map(products.map((p) => [p.slug, p]));

  let subtotal = 0;
  const itemsToCreate = body.lines.map((line) => {
    const product = priceMap.get(line.slug);
    if (!product) {
      throw new Error(`Unknown product: ${line.slug}`);
    }
    const quantity = Math.max(1, Math.floor(line.quantity));
    subtotal += product.price * quantity;
    return {
      productSlug: product.slug,
      productName: product.name,
      price: product.price,
      quantity,
    };
  });

  const deliveryFee = DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const orderRef = `GD-${Date.now()}`;
  const order = await db.order.create({
    data: {
      orderRef,
      userId: session.user.id,
      customerName: `${body.customer.firstName} ${body.customer.lastName}`.trim(),
      customerEmail: body.customer.email,
      customerPhone: body.customer.phone,
      address: body.customer.address,
      city: body.customer.city,
      notes: body.customer.notes ?? null,
      subtotal,
      deliveryFee,
      total,
      status: "pending",
      items: { create: itemsToCreate },
    },
  });

  // Save phone to customer profile if not yet set (for next-time prefill).
  if (body.customer.phone) {
    await db.user.update({
      where: { id: session.user.id },
      data: { phone: body.customer.phone },
    });
  }

  const merchantId = process.env.PAYHERE_MERCHANT_ID;
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!merchantId || !merchantSecret) {
    return NextResponse.json(
      {
        error:
          "PayHere not configured. Set PAYHERE_MERCHANT_ID and PAYHERE_MERCHANT_SECRET in .env.",
        orderRef,
      },
      { status: 500 }
    );
  }

  const currency = "LKR";
  const hash = buildCheckoutHash({
    merchantId,
    merchantSecret,
    orderId: orderRef,
    amount: total,
    currency,
  });

  const itemsSummary = itemsToCreate
    .map((i) => `${i.quantity}× ${i.productName}`)
    .join(", ")
    .slice(0, 200);

  const payload = {
    sandbox: process.env.PAYHERE_MODE !== "live",
    merchant_id: merchantId,
    return_url: `${appUrl}/checkout/success?order=${orderRef}`,
    cancel_url: `${appUrl}/checkout`,
    notify_url: `${appUrl}/api/payhere/notify`,
    order_id: orderRef,
    items: itemsSummary,
    amount: total.toFixed(2),
    currency,
    hash,
    first_name: body.customer.firstName,
    last_name: body.customer.lastName,
    email: body.customer.email,
    phone: body.customer.phone,
    address: body.customer.address,
    city: body.customer.city,
    country: "Sri Lanka",
  };

  return NextResponse.json({
    payload,
    checkoutUrl: PAYHERE_CHECKOUT_URL,
    orderRef,
    orderId: order.id,
  });
}
