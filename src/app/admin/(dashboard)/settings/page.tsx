import { getShopStatus } from "@/lib/site-config";
import { ShopSettingsForm } from "./ShopSettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const status = await getShopStatus();

  return (
    <div className="space-y-8 max-w-2xl">
      <header>
        <h1 className="font-display text-5xl">SETTINGS</h1>
        <p className="text-muted text-sm mt-1">
          Site-wide controls. Changes apply immediately.
        </p>
      </header>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-display text-2xl">SHOP STATUS</h2>
          <span
            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] border ${
              status.isOpen
                ? "bg-foreground text-background border-foreground"
                : "text-muted border-muted line-through"
            }`}
          >
            {status.isOpen ? "OPEN" : "CLOSED"}
          </span>
        </div>
        <ShopSettingsForm
          defaultIsOpen={status.isOpen}
          defaultClosedMessage={status.closedMessage}
        />
      </section>
    </div>
  );
}
