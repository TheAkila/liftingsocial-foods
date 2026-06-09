"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const VALID_STATUSES = ["pending", "paid", "failed", "cancelled", "chargedback"];

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  if (!VALID_STATUSES.includes(status)) throw new Error("Invalid status");
  await db.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
}
