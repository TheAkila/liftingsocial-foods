"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createUser, type UserFormState } from "../actions";

export function NewUserForm() {
  const [state, formAction, pending] = useActionState<UserFormState, FormData>(createUser, null);
  const errs = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="border border-border bg-surface p-6 space-y-4">
      <Field label="Name" name="name" required error={errs.name} />
      <Field label="Email" name="email" type="email" required error={errs.email} />
      <Field
        label="Temporary Password"
        name="password"
        type="password"
        required
        help="At least 8 characters. They can change it later."
        error={errs.password}
      />
      <div>
        <label className="block text-xs uppercase tracking-[0.15em] text-muted mb-2" htmlFor="role">
          Role
        </label>
        <select
          id="role"
          name="role"
          defaultValue="admin"
          className="w-full bg-background border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
        >
          <option value="admin">Admin (full access)</option>
          <option value="staff">Staff</option>
        </select>
        {errs.role && <p className="text-xs text-accent mt-1">{errs.role}</p>}
      </div>

      {state?.error && (
        <div className="text-sm text-accent border border-accent/40 bg-accent/5 px-3 py-2">
          {state.error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary flex-1 text-sm disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create Member"}
        </button>
        <Link href="/admin/users" className="btn-ghost text-sm">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  help,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  help?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.15em] text-muted mb-2" htmlFor={name}>
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className={`w-full bg-background border px-3 py-2 text-sm focus:outline-none ${
          error ? "border-accent" : "border-border focus:border-accent"
        }`}
      />
      {error && <p className="text-xs text-accent mt-1">{error}</p>}
      {help && !error && <p className="text-xs text-muted mt-1">{help}</p>}
    </div>
  );
}
