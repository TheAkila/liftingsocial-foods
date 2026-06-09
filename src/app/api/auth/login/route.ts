import { NextResponse } from "next/server";
import { login, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Email and password required." }, { status: 400 });
  }

  const result = await login(body.email, body.password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  await setSessionCookie(result.token);
  return NextResponse.json({ ok: true, user: result.user });
}
