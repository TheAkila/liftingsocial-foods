"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      router.push(nextPath && nextPath.startsWith("/admin") ? nextPath : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-surface border border-border p-6">
      <div>
        <label className="block text-xs uppercase tracking-[0.15em] text-muted mb-2" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full bg-background border border-border px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
        />
      </div>
      <div>
        <label
          className="block text-xs uppercase tracking-[0.15em] text-muted mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full bg-background border border-border px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
        />
      </div>
      {error && (
        <div className="text-sm text-accent border border-accent/40 bg-accent/5 px-3 py-2">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full text-sm disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign In →"}
      </button>
    </form>
  );
}
