import { Flame } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { FAVORITES, PHONE_TEL, type MenuItem } from "@/data/menu";

const Heat = ({ level }: { level: number }) => (
  <span className="flex gap-0.5" aria-label={`Heat level ${level} of 3`}>
    {[0, 1, 2].map((i) => (
      <Flame key={i} className={`h-3.5 w-3.5 ${i < level ? "text-flame" : "text-white/20"}`} />
    ))}
  </span>
);

const FavCard = ({ item, big, delay }: { item: MenuItem; big?: boolean; delay: number }) => (
  <Reveal delay={delay} className={big ? "sm:col-span-2 sm:row-span-2" : ""}>
    <article
      data-testid={`fav-card-${item.id}`}
      className="group relative h-full overflow-hidden border-2 border-white/10 bg-panel transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:border-gold hover:shadow-[0_12px_24px_rgba(255,69,0,0.2)]"
    >
      <div className={`relative overflow-hidden ${big ? "aspect-[16/10]" : "aspect-[16/9]"}`}>
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
        {item.badge && (
          <span className="sticker absolute left-3 top-3 rotate-[-4deg] bg-scarlet px-3 py-1 text-[10px] text-white">{item.badge}</span>
        )}
      </div>
      <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div>
          <h3 className="font-heading text-lg font-bold uppercase tracking-tight sm:text-xl">{item.name}</h3>
          <div className="mt-1 flex items-center gap-3">
            <span className="font-mono2 text-sm font-bold text-gold">${item.price}</span>
            <Heat level={item.heat} />
          </div>
        </div>
        <a
          href={PHONE_TEL}
          data-testid={`fav-order-${item.id}`}
          className="sticker shrink-0 rotate-2 bg-flame px-3 py-2 text-[10px] text-white transition-transform hover:rotate-0"
        >
          Order
        </a>
      </div>
    </article>
  </Reveal>
);

export const FanFavorites = () => (
  <section id="favorites" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28" data-testid="fan-favorites-section">
    <Reveal>
      <p className="font-mono2 text-xs uppercase tracking-[0.3em] text-gold">Heavy Hitters</p>
      <h2 className="display-graffiti mt-3 font-heading text-3xl font-bold uppercase tracking-tighter text-white sm:text-4xl lg:text-5xl">
        Fan Favorites
      </h2>
      <p className="mt-4 max-w-xl text-base text-slate-400">The five plates the block keeps coming back for. First-timers: start here.</p>
    </Reveal>
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <FavCard item={FAVORITES[0]} big delay={0} />
      <FavCard item={FAVORITES[1]} delay={0.08} />
      <FavCard item={FAVORITES[2]} delay={0.16} />
      <FavCard item={FAVORITES[3]} delay={0.24} />
      <FavCard item={FAVORITES[4]} delay={0.32} />
    </div>
  </section>
);
