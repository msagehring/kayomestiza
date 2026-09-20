import { SiInstagram } from "@icons-pack/react-simple-icons";
import { Reveal } from "@/components/Reveal";
import { IMG, INSTAGRAM } from "@/data/menu";

const SHOTS = [
  { img: IMG.crowd, cap: "Friday night block energy" },
  { img: IMG.lumpia, cap: "Golden hour, literal gold" },
  { img: IMG.griddle, cap: "Flat-top fireworks" },
  { img: IMG.stickers, cap: "The window, mid-sticker-bomb" },
  { img: IMG.burger, cap: "PB&J smash, no regrets" },
  { img: IMG.turon, cap: "Turon magic, bourbon drizzle" },
  { img: IMG.skewers, cap: "Baboy over open flame" },
  { img: IMG.tacos, cap: "Adobo tacos, calamansi squeeze" },
];

export const GallerySection = () => (
  <section id="gallery" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28" data-testid="gallery-section">
    <Reveal>
      <p className="font-mono2 text-xs uppercase tracking-[0.3em] text-gold">The Feed</p>
      <h2 className="display-graffiti mt-3 font-heading text-3xl font-bold uppercase tracking-tighter text-white sm:text-4xl lg:text-5xl">
        Street Gallery
      </h2>
      <a
        href={INSTAGRAM}
        target="_blank"
        rel="noreferrer"
        data-testid="gallery-follow-btn"
        className="sticker mt-6 inline-block rotate-[-2deg] bg-deepblue px-5 py-3 text-xs text-white transition-transform hover:rotate-0"
      >
        <SiInstagram className="mr-2 inline h-4 w-4" /> Follow @kayomestiza
      </a>
    </Reveal>
    <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4" data-testid="gallery-grid">
      {SHOTS.map((s, i) => (
        <Reveal key={s.img + i} delay={(i % 4) * 0.06} className="mb-4 break-inside-avoid">
          <figure
            data-testid={`gallery-item-${i}`}
            className={`group relative overflow-hidden border-2 border-white/10 bg-panel transition-[transform,border-color] duration-300 hover:border-gold ${i % 2 ? "rotate-1" : "-rotate-1"} hover:rotate-0`}
          >
            <img src={s.img} alt={s.cap} loading="lazy" className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8">
              <span className="font-mono2 text-[10px] uppercase tracking-wider text-gold">{s.cap}</span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  </section>
);
