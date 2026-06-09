import Link from "next/link";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { UserRowActions } from "./UserRowActions";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const [users, session] = await Promise.all([
    db.user.findMany({ orderBy: { createdAt: "asc" } }),
    getSession(),
  ]);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="font-display text-5xl">TEAM</h1>
          <p className="text-muted text-sm mt-1">{users.length} member{users.length === 1 ? "" : "s"}</p>
        </div>
        <Link href="/admin/users/new" className="btn-primary text-sm">
          + Add Member
        </Link>
      </header>

      <div className="border border-border bg-surface divide-y divide-border">
        {users.map((u) => (
          <div key={u.id} className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 shrink-0 bg-accent text-background flex items-center justify-center font-display text-lg">
              {u.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold flex items-center gap-2 flex-wrap">
                {u.name}
                {u.id === session?.userId && (
                  <span className="text-[10px] uppercase tracking-[0.15em] text-accent border border-accent/40 px-1.5 py-0.5">
                    You
                  </span>
                )}
              </div>
              <div className="text-sm text-muted">{u.email}</div>
            </div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-muted border border-border px-2 py-0.5">
              {u.role}
            </div>
            {u.id !== session?.userId && <UserRowActions id={u.id} name={u.name} />}
          </div>
        ))}
      </div>
    </div>
  );
}
