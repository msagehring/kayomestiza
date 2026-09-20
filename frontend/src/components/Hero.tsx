import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Flame, MapPin, UtensilsCrossed } from "lucide-react";
import { FilipinoSunIcon } from "@/components/FilipinoSunIcon";
import { IMG } from "@/data/menu";
import { useContact } from "@/hooks/useSettings";

const wrap = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};
const badge = {
  hidden: { scale: 0.6, opacity: 0, rotate: -10 },
  show: { scale: 1, opacity: 1, rotate: -3, transition: { duration: 0.6, ease: "backOut" as const } },
};

export const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const contact = useContact();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yTruck = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const sunRotate = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section id="home" ref={ref} className="grain relative min-h-screen overflow-hidden pt-16" data-testid="hero-section">
      <motion.div className="absolute inset-0" style={{ y: yTruck }}>
        <img src={IMG.hero} alt="Kayo Mestiza food truck at a night street festival" className="h-[120%] w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,12,16,0.88)_0%,rgba(11,12,16,0.66)_45%,rgba(11,12,16,0.97)_100%),radial-gradient(circle_at_50%_30%,rgba(255,69,0,0.18)_0%,transparent_70%)]" />
      </motion.div>

      <motion.div style={{ rotate: sunRotate }} className="absolute -right-24 top-24 text-gold/15 sm:right-8">
        <FilipinoSunIcon className="h-72 w-72 sm:h-96 sm:w-96" />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6">
        <motion.div variants={wrap} initial="hidden" animate="show">
          <div className="overflow-hidden">
            <motion.p variants={line} className="font-mono2 text-xs uppercase tracking-[0.3em] text-gold sm:text-sm" data-testid="hero-overline">
              Filipino-American Street Eats &#9733; Est. on the Block
            </motion.p>
          </div>
          <h1 className="mt-6">
            <span className="sr-only">Kayo Mestiza</span>
            <span className="block overflow-hidden">
              <motion.img
                variants={line}
                src="/wordmark.png"
                alt=""
                data-testid="hero-wordmark"
                className="w-full max-w-[340px] -rotate-2 drop-shadow-[10px_12px_0_rgba(0,0,0,0.6)] sm:max-w-[520px] lg:max-w-[640px]"
              />
            </span>
          </h1>
          <div className="mt-6 overflow-hidden">
            <motion.span variants={badge} className="sticker inline-block bg-scarlet px-4 py-2 text-sm text-white sm:text-base" data-testid="hero-tagline">
              Blasian Fire &amp; Street Eats
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.p variants={line} className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg" data-testid="hero-subcopy">
              Where a streetwear drop collides with a Filipino food festival. Charcoal smoke, smashed patties, golden lumpia — served loud.
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a href="#menu" data-testid="hero-view-menu-btn" className="sticker bg-gold px-7 py-4 text-sm text-black transition-transform hover:-translate-y-1 hover:rotate-1">
            <UtensilsCrossed className="mr-2 inline h-4 w-4" /> View Menu
          </a>
          <a href="#schedule" data-testid="hero-find-truck-btn" className="sticker bg-deepblue px-7 py-4 text-sm text-white transition-transform hover:-translate-y-1 hover:-rotate-1">
            <MapPin className="mr-2 inline h-4 w-4" /> Find the Truck
          </a>
          <a href={contact.tel} data-testid="hero-order-now-btn" className="sticker bg-flame px-7 py-4 text-sm text-white transition-transform hover:-translate-y-1 hover:rotate-1">
            <Flame className="mr-2 inline h-4 w-4" /> Order Now
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, rotate: 4 }}
          animate={{ opacity: 1, y: 0, rotate: 2 }}
          transition={{ delay: 1.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="animate-float-slow relative mt-14 w-64 self-end sm:absolute sm:bottom-16 sm:right-6 sm:mt-0 sm:w-80"
          data-testid="hero-dish-card"
        >
          <div className="clip-frame border-2 border-gold/60 bg-panel p-2 shadow-[8px_8px_0_rgba(0,0,0,0.8)]">
            <img src={IMG.melt} alt="Longaniza Melt with gooey cheese pull" className="clip-frame aspect-square w-full object-cover" />
            <div className="flex items-center justify-between px-2 py-3">
              <span className="font-heading text-sm font-bold uppercase">Longaniza Melt</span>
              <span className="flex gap-0.5 text-flame">
                <Flame className="h-4 w-4" /><Flame className="h-4 w-4" />
              </span>
            </div>
          </div>
          <span className="sticker absolute -left-3 -top-3 rotate-[-6deg] bg-gold px-3 py-1 text-[10px] text-black">Griddle King</span>
        </motion.div>
      </div>
    </section>
  );
};
