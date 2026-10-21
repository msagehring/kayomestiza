import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { PartyPopper } from "lucide-react";
import { ApiError } from "@/lib/api";
import { sendForm } from "@/lib/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/Reveal";
import { PACKAGES } from "@/data/menu";

export const CateringSection = () => {
  const [pkg, setPkg] = useState<string>(PACKAGES[0].id);
  const [form, setForm] = useState({ name: "", email: "", phone: "", event_date: "", guests: "", message: "" });

  const mutation = useMutation({
    mutationFn: () =>
      sendForm("Catering inquiry", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        event_date: form.event_date || "not given",
        guests: form.guests || "not given",
        package: PACKAGES.find((p) => p.id === pkg)?.name ?? pkg,
      }),
    onSuccess: () => {
      toast.success("Catering inquiry sent! We'll hit you back within 24 hours.");
      setForm({ name: "", email: "", phone: "", event_date: "", guests: "", message: "" });
    },
    onError: (e) => {
      toast.error(e instanceof ApiError ? "Could not send — check your details and try again." : "Network error, try again.");
    },
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section id="catering" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28" data-testid="catering-section">
      <Reveal>
        <p className="font-mono2 text-xs uppercase tracking-[0.3em] text-gold">Book the Truck</p>
        <h2 className="display-graffiti mt-3 font-heading text-3xl font-bold uppercase tracking-tighter text-white sm:text-4xl lg:text-5xl">
          Catering &amp; Events
        </h2>
        <p className="mt-4 max-w-xl text-base text-slate-400">
          Weddings, block parties, office drops — tell us what you're planning and we'll send a quote built around your menu, headcount, and location.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {PACKAGES.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08}>
            <button
              type="button"
              onClick={() => setPkg(p.id)}
              data-testid={`catering-package-${p.id}`}
              className={`sticker w-full cursor-pointer p-5 text-left transition-transform hover:-translate-y-1 ${
                pkg === p.id ? "rotate-0 bg-gold text-black" : "rotate-[-1deg] bg-elev text-white"
              }`}
            >
              <PartyPopper className={`mb-2 h-5 w-5 ${pkg === p.id ? "text-scarlet" : "text-gold"}`} />
              <span className="block text-base">{p.name}</span>
              <span className={`mt-2 block font-sans text-sm normal-case ${pkg === p.id ? "text-black/70" : "text-slate-400"}`}>{p.desc}</span>
              <span className={`mt-3 block font-mono2 text-xs font-bold uppercase ${pkg === p.id ? "text-scarlet" : "text-gold"}`}>{p.price}</span>
            </button>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1}>
        <form
          data-testid="catering-form"
          className="mt-8 grid gap-5 border-2 border-white/10 bg-panel p-6 sm:grid-cols-2 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div>
            <Label htmlFor="catering-name" className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Your Name *</Label>
            <Input id="catering-name" data-testid="catering-name-input" required value={form.name} onChange={set("name")} className="mt-2 border-white/20 bg-coal text-white" placeholder="Juan Dela Cruz" />
          </div>
          <div>
            <Label htmlFor="catering-email" className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Email *</Label>
            <Input id="catering-email" data-testid="catering-email-input" required type="email" value={form.email} onChange={set("email")} className="mt-2 border-white/20 bg-coal text-white" placeholder="you@email.com" />
          </div>
          <div>
            <Label htmlFor="catering-phone" className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Phone</Label>
            <Input id="catering-phone" data-testid="catering-phone-input" value={form.phone} onChange={set("phone")} className="mt-2 border-white/20 bg-coal text-white" placeholder="(540) 555-0100" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="catering-date" className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Event Date</Label>
              <Input id="catering-date" data-testid="catering-date-input" type="date" value={form.event_date} onChange={set("event_date")} className="mt-2 border-white/20 bg-coal text-white" />
            </div>
            <div>
              <Label htmlFor="catering-guests" className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Guests</Label>
              <Input id="catering-guests" data-testid="catering-guests-input" type="number" min={1} value={form.guests} onChange={set("guests")} className="mt-2 border-white/20 bg-coal text-white" placeholder="50" />
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="catering-message" className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Tell us about the event *</Label>
            <Textarea id="catering-message" data-testid="catering-message-input" required rows={4} value={form.message} onChange={set("message")} className="mt-2 border-white/20 bg-coal text-white" placeholder="Backyard birthday in Fredericksburg, need the truck 5–9pm, two vegetarians…" />
          </div>
          <p className="font-mono2 text-[10px] uppercase tracking-wider text-slate-500 sm:col-span-2" data-testid="catering-quote-note">
            Every event is quoted individually — nothing is confirmed until we agree on menu, timing, and location.
          </p>
          <div className="sm:col-span-2">
            <Button type="submit" data-testid="catering-submit-btn" disabled={mutation.isPending} className="sticker h-auto rotate-[-1deg] bg-flame px-8 py-4 font-heading text-sm text-white hover:bg-scarlet">
              {mutation.isPending ? "Sending…" : "Send Catering Inquiry"}
            </Button>
          </div>
        </form>
      </Reveal>
    </section>
  );
};
