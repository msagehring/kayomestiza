import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bell, Flame, Lock } from "lucide-react";
import { PHONE_SMS } from "@/data/menu";

function nextDrop(): number {
  const now = new Date();
  const target = new Date(now);
  target.setHours(12, 0, 0, 0);
  let add = (6 - now.getDay() + 7) % 7; // Saturday
  if (add === 0 && now.getTime() > target.getTime()) add = 7;
  target.setDate(now.getDate() + add);
  return target.getTime();
}

const DROP_TIME = nextDrop();

const pad = (n: number) => String(n).padStart(2, "0");

const TimeBox = ({ value, label, testid }: { value: string; label: string; testid: string }) => (
  <div className="sticker bg-gold px-3 py-2 text-center sm:px-6 sm:py-4" data-testid={testid}>
    <span className="block font-heading text-2xl font-bold tabular-nums text-black sm:text-5xl">{value}</span>
    <span className="block font-mono2 text-[9px] uppercase tracking-[0.25em] text-black/70 sm:text-xs">{label}</span>
  </div>
);

export const DropCountdown = () => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remaining = Math.max(0, DROP_TIME - now);
  const live = remaining === 0;
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const mins = Math.floor((remaining % 3600000) / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);

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
            Drop 001 — Primetime Launch
          </p>
          <h2 className="display-graffiti mt-4 font-heading text-3xl font-bold uppercase tracking-tighter text-white sm:text-5xl lg:text-6xl">
            Never Seen.
            <br />
            <span className="bg-[linear-gradient(135deg,#FF4500_0%,#FFD700_100%)] bg-clip-text text-transparent">Never Tasted.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-400 sm:text-base">
            A brand-new lumpia creation hits the truck window Saturday at noon. Limited batch. When it's gone, it's gone forever.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 border-2 border-dashed border-flame/50 bg-elev px-5 py-3" data-testid="drop-mystery-item">
            <Lock className="h-4 w-4 text-gold" />
            <span className="font-heading text-sm font-bold uppercase tracking-widest text-slate-300 blur-[3px] select-none">Secret Lumpia</span>
            <span className="sticker rotate-3 bg-scarlet px-2 py-0.5 text-[9px] text-white">Classified</span>
          </div>

          {live ? (
            <p className="mt-10 font-heading text-2xl font-bold uppercase text-gold sm:text-4xl" data-testid="drop-live-banner">
              <Flame className="mr-2 inline h-7 w-7 text-flame" /> The drop is LIVE — find the truck
            </p>
          ) : (
            <div className="mt-10 flex flex-wrap items-stretch justify-center gap-3 sm:gap-4" data-testid="drop-timer">
              <TimeBox value={pad(days)} label="Days" testid="drop-countdown-days" />
              <TimeBox value={pad(hours)} label="Hours" testid="drop-countdown-hours" />
              <TimeBox value={pad(mins)} label="Mins" testid="drop-countdown-mins" />
              <TimeBox value={pad(secs)} label="Secs" testid="drop-countdown-secs" />
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#newsletter" data-testid="drop-notify-btn" className="sticker rotate-[-1deg] bg-flame px-7 py-4 text-sm text-white transition-transform hover:-translate-y-1 hover:rotate-1">
              <Bell className="mr-2 inline h-4 w-4" /> Get Drop Alerts
            </a>
            <a href={PHONE_SMS} data-testid="drop-text-btn" className="sticker rotate-1 bg-transparent px-7 py-4 text-sm text-gold !border-gold transition-transform hover:-translate-y-1 hover:-rotate-1" style={{ borderColor: "#FFD700" }}>
              Text "DROP" to the Truck
            </a>
          </div>
          <p className="mt-4 font-mono2 text-[10px] uppercase tracking-[0.25em] text-slate-500">
            Saturday 12:00 PM &#9733; TreasureFest &#9733; First 100 servings only
          </p>
        </motion.div>
      </div>
    </section>
  );
};
