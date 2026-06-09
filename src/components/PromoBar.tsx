const messages = [
  "GymDine",
  "Eat Like You Train",
  "Macro-Tracked Protein Meals",
  "Ready Meals Across Sri Lanka",
  "30g+ Protein Per Meal",
  "Fuel for Champions",
];

export function PromoBar() {
  // Duplicate the message list so the marquee loops seamlessly (-50% translate).
  const track = [...messages, ...messages];
  return (
    <div className="bg-foreground text-background overflow-hidden">
      <div className="marquee-track flex whitespace-nowrap py-2.5 text-xs font-bold uppercase tracking-[0.18em]">
        {track.map((msg, i) => (
          <span key={i} className="shrink-0 px-8">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
