type Props = {
  name: string;
  category: string;
  image?: string | null;
  className?: string;
};

const palettes: Record<string, [string, string]> = {
  dinner: ["#1c0f0a", "#3a1a0c"],
  lunch: ["#0f1c0a", "#1a3a0c"],
  breakfast: ["#1c150a", "#3a2c0c"],
  snack: ["#0a1a1c", "#0c2e3a"],
};

export function ProductImage({ name, category, image, className }: Props) {
  if (image) {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-surface ${className ?? ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  const [from, to] = palettes[category] ?? palettes.dinner;
  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className ?? ""}`}
      style={{
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 14px, rgba(255,255,255,.6) 14px 15px)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="font-display text-center leading-[0.85] text-foreground/90 text-[clamp(2.2rem,7vw,4.5rem)]">
          {name
            .split(" ")
            .map((w, i) => (
              <div key={i}>{w.toUpperCase()}</div>
            ))}
        </div>
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/40">
        <span>LS Foods</span>
        <span>{category}</span>
      </div>
    </div>
  );
}
