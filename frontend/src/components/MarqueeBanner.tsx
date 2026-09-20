const PHRASES = [
  "BLASIAN FIRE",
  "FRESH LUMPIA ON DECK",
  "TOCINO SMASH BURGERS",
  "BABOY SKEWERS SIZZLING",
  "STREETWEAR DROPS",
  "BOOK CATERING NOW",
];

export const MarqueeBanner = () => {
  const row = [...PHRASES, ...PHRASES];
  return (
    <div className="marquee-hover relative -rotate-1 border-y-4 border-black bg-gold py-3 overflow-hidden" data-testid="marquee-banner">
      <div className="animate-marquee flex w-max items-center gap-8 pr-8">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-8" aria-hidden={half === 1}>
            {row.map((p, i) => (
              <span key={`${half}-${i}`} className="flex items-center gap-8 whitespace-nowrap font-heading text-lg font-bold uppercase tracking-wider text-black">
                {p}
                <span className="text-scarlet">&#9733;</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
