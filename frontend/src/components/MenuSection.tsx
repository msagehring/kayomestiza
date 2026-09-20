import { Flame } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/components/Reveal";
import { MENU, fmtPrice } from "@/data/menu";
import { useContact } from "@/hooks/useSettings";

export const MenuSection = () => {
  const contact = useContact();
  return (
  <section id="menu" className="relative bg-panel/40 py-20 sm:py-28" data-testid="menu-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <Reveal>
        <p className="font-mono2 text-xs uppercase tracking-[0.3em] text-gold">The Full Spread</p>
        <h2 className="display-graffiti mt-3 font-heading text-3xl font-bold uppercase tracking-tighter text-white sm:text-4xl lg:text-5xl">
          Street Menu
        </h2>
      </Reveal>
      <Tabs defaultValue={MENU[0].id} className="mt-10">
        <TabsList variant="line" className="w-full flex-wrap justify-start gap-2 border-b-2 border-white/10 bg-transparent pb-2">
          {MENU.map((c) => (
            <TabsTrigger
              key={c.id}
              value={c.id}
              data-testid={`menu-tab-${c.id}`}
              className="sticker cursor-pointer border-white/20 bg-elev px-4 py-2 text-[11px] text-slate-300 shadow-[3px_3px_0_#000] data-[selected]:bg-gold data-[selected]:text-black"
            >
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {MENU.map((c) => (
          <TabsContent key={c.id} value={c.id} className="mt-8">
            <p className="font-mono2 text-sm uppercase tracking-[0.2em] text-slate-400">{c.blurb}</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {c.items.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.06}>
                  <article
                    data-testid={`menu-item-${item.id}`}
                    className="group flex h-full gap-4 border-2 border-white/10 bg-coal p-4 transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-gold sm:p-5"
                  >
                    {item.image && (
                      <div className="clip-frame hidden h-24 w-24 shrink-0 overflow-hidden border border-gold/40 sm:block">
                        <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-heading text-base font-bold uppercase tracking-tight text-white sm:text-lg">{item.name}</h3>
                        <span className="shrink-0 font-mono2 text-base font-bold text-gold">{fmtPrice(item.price)}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {item.tags.map((t) => (
                          <span key={t} className="border border-white/15 bg-elev px-2 py-0.5 font-mono2 text-[10px] uppercase tracking-wider text-slate-300">
                            {t}
                          </span>
                        ))}
                        <span className="flex gap-0.5">
                          {[0, 1, 2].map((f) => (
                            <Flame key={f} className={`h-3.5 w-3.5 ${f < item.heat ? "text-flame" : "text-white/20"}`} />
                          ))}
                        </span>
                        <a
                          href={contact.tel}
                          data-testid={`menu-order-${item.id}`}
                          className="ml-auto font-mono2 text-[11px] font-bold uppercase tracking-wider text-flame underline-offset-4 hover:underline"
                        >
                          Call to order
                        </a>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  </section>
  );
};
