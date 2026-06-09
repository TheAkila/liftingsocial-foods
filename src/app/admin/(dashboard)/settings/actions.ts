"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { setShopStatus } from "@/lib/site-config";

export type ShopSettingsState =
  | { ok: true; message: string }
  | { ok: false; error: string }
  | null;

export async function updateShopSettings(
  _prev: ShopSettingsState,
  formData: FormData
): Promise<ShopSettingsState> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Unauthorized" };

  const isOpen = formData.get("isOpen") === "on";
  const closedMessage = String(formData.get("closedMessage") ?? "").trim();

  await setShopStatus(isOpen, closedMessage || undefined);

  // Public pages all force-dynamic so revalidate covers them; admin too.
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");

  return {
    ok: true,
    message: isOpen ? "Shop is now OPEN. Customers can place orders." : "Shop is now CLOSED. Orders are blocked.",
  };
}
