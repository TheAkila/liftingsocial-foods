const messages = [
  "GymDine",
  "Eat Like You Train",
  "Macro-Tracked Protein Meals",
  "Delivered Cold Across Sri Lanka",
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
          <span key={i} className="flex items-center shrink-0 px-6">
            <span>{msg}</span>
            <span className="ml-6 opacity-60" aria-hidden>
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
