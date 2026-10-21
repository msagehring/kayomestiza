import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Bell, Flame, Lock } from "lucide-react";
import { useSettings, useContact } from "@/hooks/useSettings";

const pad = (n: number) => String(n).padStart(2, "0");

const TimeBox = ({ value, label, testid }: { value: string; label: string; testid: string }) => (
  <div className="sticker bg-gold px-3 py-2 text-center sm:px-6 sm:py-4" data-testid={testid}>
    <span className="block font-heading text-2xl font-bold tabular-nums text-black sm:text-5xl">{value}</span>
    <span className="block font-mono2 text-[9px] uppercase tracking-[0.25em] text-black/70 sm:text-xs">{label}</span>
  </div>
);

export const DropCountdown = () => {
  const { drop } = useSettings();
  const contact = useContact();
  const [now, setNow] = useState(() => Date.now());

  // No date set => waitlist mode: no timer, no fake "drop" promise.
  const dropTime = useMemo(() => {
    if (!drop.drop_at) return null;
    const t = new Date(drop.drop_at).getTime();
    return Number.isNaN(t) ? null : t;
  }, [drop.drop_at]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!drop.enabled) return null;

  const remaining = dropTime === null ? null : Math.max(0, dropTime - now);
  const live = remaining === 0;

  return (
    <section id="drop" className="grain relative overflow-hidden bg-black py-16 sm:py-24" data-testid="drop-countdown-section">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(255,69,0,0.28)_0%,transparent_60%)]" />
      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="inline-flex items-center gap-2 font-mono2 text-xs uppercase tracking-[0.3em] text-flame" data-testid="drop-overline">
            <span className="animate-flame-pulse inline-block h-2 w-2 rounded-full bg-flame" />
            {drop.overline}
          </p>
          <h2 className="display-graffiti mt-4 font-heading text-3xl font-bold uppercase tracking-tighter text-white sm:text-5xl lg:text-6xl">
            {remaining === null ? (
              <>
                Soft Launch
                <br />
                <span className="bg-[linear-gradient(135deg,#FF4500_0%,#FFD700_100%)] bg-clip-text text-transparent">Coming Soon.</span>
              </>
            ) : (
              <>
                Soft Launch.
                <br />
                <span className="bg-[linear-gradient(135deg,#FF4500_0%,#FFD700_100%)] bg-clip-text text-transparent">Delivery Starts Nov 2.</span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-400 sm:text-base" data-testid="drop-subtitle">
            {drop.subtitle}
          </p>

          {remaining !== null && drop.item_name && (
            <div className="mt-6 inline-flex items-center gap-2 border-2 border-dashed border-flame/50 bg-elev px-5 py-3" data-testid="drop-mystery-item">
              <Lock className="h-4 w-4 text-gold" />
              <span className="font-heading text-sm font-bold uppercase tracking-widest text-slate-300 blur-[3px] select-none">{drop.item_name}</span>
              <span className="sticker rotate-3 bg-scarlet px-2 py-0.5 text-[9px] text-white">Classified</span>
            </div>
          )}

          {remaining !== null &&
            (live ? (
              <p className="mt-10 font-heading text-2xl font-bold uppercase text-gold sm:text-4xl" data-testid="drop-live-banner">
                <Flame className="mr-2 inline h-7 w-7 text-flame" /> We're live — call or text your order
              </p>
            ) : (
              <div className="mt-10 flex flex-wrap items-stretch justify-center gap-3 sm:gap-4" data-testid="drop-timer">
                <TimeBox value={pad(Math.floor(remaining / 86400000))} label="Days" testid="drop-countdown-days" />
                <TimeBox value={pad(Math.floor((remaining % 86400000) / 3600000))} label="Hours" testid="drop-countdown-hours" />
                <TimeBox value={pad(Math.floor((remaining % 3600000) / 60000))} label="Mins" testid="drop-countdown-mins" />
                <TimeBox value={pad(Math.floor((remaining % 60000) / 1000))} label="Secs" testid="drop-countdown-secs" />
              </div>
            ))}

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#newsletter" data-testid="drop-notify-btn" className="sticker rotate-[-1deg] bg-flame px-7 py-4 text-sm text-white transition-transform hover:-translate-y-1 hover:rotate-1">
              <Bell className="mr-2 inline h-4 w-4" /> {remaining === null ? "Join the List" : "Get Drop Alerts"}
            </a>
            <a href={contact.sms} data-testid="drop-text-btn" className="sticker rotate-1 bg-transparent px-7 py-4 text-sm text-gold !border-gold transition-transform hover:-translate-y-1 hover:-rotate-1" style={{ borderColor: "#FFD700" }}>
              Text Your Order
            </a>
          </div>
          <p className="mt-4 font-mono2 text-[10px] uppercase tracking-[0.25em] text-slate-500" data-testid="drop-location-note">
            {drop.location_note}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
