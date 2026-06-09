import { db } from "./db";

const KEYS = {
  shopStatus: "shop.status",
  shopClosedMessage: "shop.closedMessage",
} as const;

const DEFAULT_CLOSED_MESSAGE =
  "We're not taking orders right now. Check back soon — we'll be open shortly.";

export type ShopStatus = {
  isOpen: boolean;
  closedMessage: string;
};

export async function getShopStatus(): Promise<ShopStatus> {
  try {
    const rows = await db.siteConfig.findMany({
      where: { key: { in: [KEYS.shopStatus, KEYS.shopClosedMessage] } },
    });
    const status = rows.find((r) => r.key === KEYS.shopStatus)?.value ?? "open";
    const closedMessage =
      rows.find((r) => r.key === KEYS.shopClosedMessage)?.value ?? DEFAULT_CLOSED_MESSAGE;
    return { isOpen: status === "open", closedMessage };
  } catch {
    // DB unreachable at build time — fail-open so the site still renders.
    return { isOpen: true, closedMessage: DEFAULT_CLOSED_MESSAGE };
  }
}

export async function setShopStatus(isOpen: boolean, closedMessage?: string): Promise<void> {
  await db.siteConfig.upsert({
    where: { key: KEYS.shopStatus },
    create: { key: KEYS.shopStatus, value: isOpen ? "open" : "closed" },
    update: { value: isOpen ? "open" : "closed" },
  });
  if (closedMessage !== undefined && closedMessage.trim().length > 0) {
    await db.siteConfig.upsert({
      where: { key: KEYS.shopClosedMessage },
      create: { key: KEYS.shopClosedMessage, value: closedMessage.trim() },
      update: { value: closedMessage.trim() },
    });
  }
}
