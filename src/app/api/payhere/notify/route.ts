import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyNotifyHash } from "@/lib/payhere";

const STATUS_MAP: Record<string, string> = {
  "2": "paid",
  "0": "pending",
  "-1": "cancelled",
  "-2": "failed",
  "-3": "chargedback",
};

export async function POST(req: Request) {
  const form = await req.formData();

  const merchantId = process.env.PAYHERE_MERCHANT_ID;
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  if (!merchantId || !merchantSecret) {
    return new NextResponse("Server not configured", { status: 500 });
  }

  const orderRef = String(form.get("order_id") ?? "");
  const amount = String(form.get("payhere_amount") ?? "");
  const currency = String(form.get("payhere_currency") ?? "");
  const statusCode = String(form.get("status_code") ?? "");
  const receivedSig = String(form.get("md5sig") ?? "");
  const paymentId = String(form.get("payment_id") ?? "");

  const ok = verifyNotifyHash({
    merchantId,
    merchantSecret,
    orderId: orderRef,
    amount,
    currency,
    statusCode,
    receivedSig,
  });

  if (!ok) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  await db.order.updateMany({
    where: { orderRef },
    data: {
      status: STATUS_MAP[statusCode] ?? "pending",
      payhereStatus: statusCode,
      payherePaymentId: paymentId || null,
    },
  });

  return new NextResponse("OK");
}
