"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession, hashPassword } from "@/lib/auth";

export type UserFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
} | null;

export async function createUser(
  _prev: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const errs: Record<string, string> = {};
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "admin");

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Valid email required";
  if (!name) errs.name = "Name required";
  if (password.length < 8) errs.password = "Min 8 characters";
  if (!["admin", "staff"].includes(role)) errs.role = "Invalid role";

  if (Object.keys(errs).length > 0) {
    return { error: "Fix the highlighted fields.", fieldErrors: errs };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { error: "Email already in use.", fieldErrors: { email: "Already exists" } };

  await db.user.create({
    data: { email, name, role, passwordHash: await hashPassword(password) },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUser(userId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  if (session.userId === userId) throw new Error("You can't delete your own account.");

  const remaining = await db.user.count({ where: { role: "admin" } });
  const target = await db.user.findUnique({ where: { id: userId } });
  if (target?.role === "admin" && remaining <= 1) {
    throw new Error("Can't delete the last admin.");
  }

  await db.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}
