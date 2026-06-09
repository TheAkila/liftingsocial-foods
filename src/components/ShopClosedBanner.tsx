import { getShopStatus } from "@/lib/site-config";

export async function ShopClosedBanner() {
  const status = await getShopStatus();
  if (status.isOpen) return null;

  return (
    <div className="bg-accent text-background">
      <div className="container-x py-2.5 flex items-center justify-center gap-3 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] border border-background/40 px-2 py-0.5 shrink-0">
          Shop Closed
        </span>
        <span className="text-xs sm:text-sm font-medium">{status.closedMessage}</span>
      </div>
    </div>
  );
}
