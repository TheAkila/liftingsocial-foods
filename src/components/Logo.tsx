import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };
  return (
    <Link
      href="/"
      className={`font-display tracking-[0.04em] leading-none ${sizes[size]} inline-flex items-center gap-2`}
    >
      <span className="inline-block w-2 h-2 bg-accent" aria-hidden />
      <span>GYMDINE</span>
    </Link>
  );
}
