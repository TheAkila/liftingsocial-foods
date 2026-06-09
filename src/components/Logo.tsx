import Image from "next/image";
import Link from "next/link";

type Size = "sm" | "md" | "lg" | "xl";

// Logo is 5000 x 1563 (aspect ratio ~3.2:1). Heights below choose visual sizes;
// width is computed from the aspect ratio.
const heights: Record<Size, number> = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 72,
};

const ASPECT = 5000 / 1563;

export function Logo({
  size = "md",
  asLink = true,
  className = "",
}: {
  size?: Size;
  asLink?: boolean;
  className?: string;
}) {
  const h = heights[size];
  const w = Math.round(h * ASPECT);
  const img = (
    <Image
      src="/gymdine-logo.png"
      alt="GymDine"
      width={w}
      height={h}
      priority={size === "md" || size === "lg" || size === "xl"}
      className="block h-auto"
      style={{ height: `${h}px`, width: "auto" }}
    />
  );
  if (!asLink) return <span className={className}>{img}</span>;
  return (
    <Link href="/" aria-label="GymDine — home" className={`inline-flex items-center ${className}`}>
      {img}
    </Link>
  );
}
