import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export const metadata: Metadata = {
  title: "Sign In",
};

type Search = Promise<{ callbackUrl?: string; error?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: Search }) {
  const { callbackUrl, error } = await searchParams;
  const session = await auth();
  if (session?.user) {
    redirect(callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/account");
  }

  async function googleSignIn() {
    "use server";
    await signIn("google", { redirectTo: callbackUrl ?? "/account" });
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-16 bg-surface">
      <div className="w-full max-w-md bg-background shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-border/60 px-10 sm:px-12 py-14 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Lifting Social</h1>
        <p className="text-sm text-muted mb-10">Sign in to your account</p>

        {error && (
          <div className="mb-6 text-sm text-foreground border border-foreground/40 bg-foreground/5 px-3 py-2 text-left">
            Sign-in failed. Try again, or use a different Google account.
          </div>
        )}

        <form action={googleSignIn}>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-3 border border-border bg-background hover:bg-surface transition-colors py-3.5 px-5 text-sm font-medium text-foreground"
          >
            <GoogleLogo />
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
