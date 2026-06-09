import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

type Search = Promise<{ next?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: Search }) {
  const { next } = await searchParams;
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block w-2 h-2 bg-accent mb-4" />
          <h1 className="font-display text-4xl">ADMIN LOGIN</h1>
          <p className="text-muted text-sm mt-2">GymDine · Operator Console</p>
        </div>
        <LoginForm nextPath={next} />
      </div>
    </div>
  );
}
