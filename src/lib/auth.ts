import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "./db";

const COOKIE_NAME = "ls_admin_session";
const SESSION_DURATION_DAYS = 14;

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set and at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: string;
  email: string;
  role: string;
};

export async function signSession(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.userId === "string" &&
      typeof payload.email === "string" &&
      typeof payload.role === "string"
    ) {
      return {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function login(
  email: string,
  password: string
): Promise<{ ok: true; token: string; user: SessionPayload } | { ok: false; error: string }> {
  const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user || !user.passwordHash) {
    // No user, or this is a customer account (Google sign-in only, no password).
    return { ok: false, error: "Invalid email or password." };
  }
  if (user.role !== "admin" && user.role !== "staff") {
    return { ok: false, error: "Invalid email or password." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { ok: false, error: "Invalid email or password." };

  const session: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  const token = await signSession(session);
  return { ok: true, token, user: session };
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
