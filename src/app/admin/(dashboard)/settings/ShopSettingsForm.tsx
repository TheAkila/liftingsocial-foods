"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { updateShopSettings, type ShopSettingsState } from "./actions";

type Props = {
  defaultIsOpen: boolean;
  defaultClosedMessage: string;
};

export function ShopSettingsForm({ defaultIsOpen, defaultClosedMessage }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ShopSettingsState, FormData>(
    updateShopSettings,
    null
  );

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <form action={formAction} className="border border-border bg-surface p-6 space-y-5">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="isOpen"
          defaultChecked={defaultIsOpen}
          className="mt-1 w-4 h-4 accent-[var(--accent)]"
        />
        <span>
          <span className="block text-sm font-bold uppercase tracking-[0.1em]">
            Shop is open for orders
          </span>
          <span className="block text-xs text-muted mt-1">
            Uncheck to close the shop. Customers can still browse the menu, but Add-to-Cart and
            Checkout are disabled, and a banner explains the shop is closed.
          </span>
        </span>
      </label>

      <div>
        <label
          htmlFor="closedMessage"
          className="block text-xs uppercase tracking-[0.15em] text-muted mb-2"
        >
          Closed Notice Message
        </label>
        <textarea
          id="closedMessage"
          name="closedMessage"
          rows={2}
          defaultValue={defaultClosedMessage}
          placeholder="We're not taking orders right now. Check back soon."
          className="w-full bg-background border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <p className="text-xs text-muted mt-1">
          Shown in the banner at the top of the public site when the shop is closed.
        </p>
      </div>

      {state?.ok && (
        <div className="text-sm border border-foreground/40 bg-foreground/5 px-3 py-2">
          {state.message}
        </div>
      )}
      {state && "ok" in state && state.ok === false && (
        <div className="text-sm text-accent border border-accent/40 bg-accent/5 px-3 py-2">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary text-sm disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
