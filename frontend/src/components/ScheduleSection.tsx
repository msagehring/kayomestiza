import { useQuery } from "@tanstack/react-query";
import { CalendarDays, MapPin, Navigation } from "lucide-react";
import { apiGet } from "@/lib/api";
import { Reveal } from "@/components/Reveal";

export interface ScheduleEntry {
  id: string;
  day: string;
  time: string;
  location: string;
  address: string;
  note: string;
  closed: boolean;
}
interface ScheduleResponse {
  entries: ScheduleEntry[];
}

const TODAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];

export const ScheduleSection = () => {
  const { data, isError } = useQuery({
    queryKey: ["schedule"],
    queryFn: () => apiGet<ScheduleResponse>("/schedule"),
  });
  const entries = isError || !data ? [] : data.entries;

  return (
    <section id="schedule" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28" data-testid="schedule-section">
      <Reveal>
        <p className="font-mono2 text-xs uppercase tracking-[0.3em] text-gold">Catch the Truck</p>
        <h2 className="display-graffiti mt-3 font-heading text-3xl font-bold uppercase tracking-tighter text-white sm:text-4xl lg:text-5xl">
          Pop-Ups &amp; Events
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4" data-testid="schedule-list">
          {entries.length === 0 && (
            <div className="border-2 border-dashed border-white/15 p-6" data-testid="schedule-empty-state">
              <p className="font-heading text-base font-bold uppercase text-gold">No pop-ups announced yet</p>
              <p className="mt-2 text-sm text-slate-400">
                We're locking in our first Fredericksburg spots now. Join the list and you'll get the date, time and
                location before anyone else.
              </p>
              <a
                href="#newsletter"
                data-testid="schedule-join-list-btn"
                className="sticker mt-5 inline-block rotate-[-1deg] bg-flame px-5 py-3 text-xs text-white transition-transform hover:rotate-0"
              >
                Get Pop-Up Alerts
              </a>
            </div>
          )}
          {entries.map((e, i) => {
            const isToday = e.day === TODAY && !e.closed;
            return (
              <Reveal key={e.id} delay={i * 0.05}>
                <article
                  data-testid={`schedule-card-${e.day.toLowerCase()}`}
                  className={`flex items-start gap-4 border-2 p-4 sm:p-5 ${
                    isToday ? "border-gold bg-elev shadow-[0_0_30px_rgba(255,215,0,0.15)]" : "border-white/10 bg-panel"
                  } ${e.closed ? "opacity-60" : ""}`}
                >
                  <div className={`sticker shrink-0 rotate-[-2deg] px-3 py-2 text-center text-[10px] ${e.closed ? "bg-elev text-slate-400" : "bg-deepblue text-white"}`}>
                    <CalendarDays className="mx-auto mb-1 h-4 w-4" />
                    {e.day.slice(0, 3)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-base font-bold uppercase text-white">{e.location}</h3>
                      {isToday && (
                        <span className="animate-flame-pulse bg-gold px-2 py-0.5 font-mono2 text-[10px] font-bold uppercase text-black" data-testid="schedule-today-badge">
                          Today
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-mono2 text-xs uppercase tracking-wider text-gold">{e.time}</p>
                    {e.address && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        data-testid={`schedule-directions-${e.day.toLowerCase()}`}
                        className="mt-1 inline-flex items-center gap-1 text-sm text-slate-400 underline-offset-4 hover:text-gold hover:underline"
                      >
                        <Navigation className="h-3.5 w-3.5" /> {e.address}
                      </a>
                    )}
                    {e.note && <p className="mt-1 text-sm italic text-slate-500">{e.note}</p>}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={0.1}>
          <div className="clip-frame sticky top-24 border-2 border-gold/50 bg-panel p-2" data-testid="schedule-map">
            <div className="flex items-center gap-2 px-2 py-3">
              <MapPin className="h-4 w-4 text-flame" />
              <span className="font-heading text-sm font-bold uppercase">Home turf: Fredericksburg, VA</span>
            </div>
            <iframe
              title="Kayo Mestiza truck map"
              src="https://www.google.com/maps?q=Fredericksburg%2C%20VA&output=embed"
              className="clip-frame aspect-[4/3] w-full border-0"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
};
