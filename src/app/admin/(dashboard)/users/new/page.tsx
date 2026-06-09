import Link from "next/link";
import { NewUserForm } from "./NewUserForm";

export default function NewUserPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <Link
          href="/admin/users"
          className="text-xs uppercase tracking-[0.15em] text-muted hover:text-accent"
        >
          ← Team
        </Link>
        <h1 className="font-display text-5xl mt-2">NEW MEMBER</h1>
      </div>
      <NewUserForm />
    </div>
  );
}
