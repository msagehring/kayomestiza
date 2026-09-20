import { Reveal } from "@/components/Reveal";
import { FilipinoSunIcon } from "@/components/FilipinoSunIcon";
import { IMG } from "@/data/menu";

const CHAPTERS = [
  {
    num: "01",
    title: "The Blasian Heritage",
    body: "Kayo Mestiza is a love letter to two tables that raised us: Black Southern soul and Filipino street corners. Mango-berry jam meets peanut butter on a smash burger. Hummingbird cake gets a cassava backbone. Nothing is fusion for the algorithm — everything is family for the culture.",
    img: IMG.crowd,
    accent: "text-gold",
  },
  {
    num: "02",
    title: "Fire & Flat-Top",
    body: "Charcoal smoke on one side, screaming-hot griddle on the other. Skewers char the Visayan way — sweet soy, garlic, calamansi — while patties get smashed thin until the edges lace up crispy. Every lumpia is rolled tight by hand and fried to a shattering gold.",
    img: IMG.griddle,
    accent: "text-flame",
  },
  {
    num: "03",
    title: "The Drop Culture",
    body: "We run the truck like a streetwear label: limited weekend specials, seasonal lumpia twists, sticker drops on the window. When the Hummingbird Cassava Cake sells out, it's gone. Follow the gram, watch the schedule, move fast.",
    img: IMG.stickers,
    accent: "text-scarlet",
  },
];

export const AboutManifesto = () => (
  <section id="about" className="grain relative bg-panel/40 py-20 sm:py-28" data-testid="about-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <Reveal>
        <p className="font-mono2 text-xs uppercase tracking-[0.3em] text-gold">The Story</p>
        <h2 className="display-graffiti mt-3 font-heading text-3xl font-bold uppercase tracking-tighter text-white sm:text-4xl lg:text-5xl">
          Manifesto
        </h2>
      </Reveal>
      <div className="mt-14 space-y-16 sm:space-y-24">
        {CHAPTERS.map((c, i) => (
          <div key={c.num} className={`grid items-center gap-8 sm:grid-cols-2 ${i % 2 ? "sm:[&>*:first-child]:order-2" : ""}`}>
            <Reveal>
              <div className="flex items-baseline gap-4">
                <span className={`font-heading text-6xl font-bold tracking-tighter ${c.accent} sm:text-7xl`}>{c.num}</span>
                <FilipinoSunIcon className={`h-8 w-8 ${c.accent}`} />
              </div>
              <h3 className="mt-4 font-heading text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">{c.title}</h3>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-400">{c.body}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className={`clip-frame border-2 ${i % 2 ? "border-flame/50" : "border-gold/50"} bg-coal p-2 ${i % 2 ? "-rotate-1" : "rotate-1"}`}>
                <img src={c.img} alt={c.title} loading="lazy" className="clip-frame aspect-[4/3] w-full object-cover" />
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </div>
  </section>
);
