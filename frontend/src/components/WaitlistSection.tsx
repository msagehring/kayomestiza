import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Bell, MessageSquare } from "lucide-react";
import { sendForm } from "@/lib/forms";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export const WaitlistSection = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sms, setSms] = useState(false);

  const join = useMutation({
    mutationFn: () => sendForm("Drop alerts sign-up", { email, phone: phone || "not given", sms_optin: sms ? "yes" : "no", source: "waitlist-section" }),
    onSuccess: () => {
      toast.success("You're on the list. We'll hit you first when the window opens.");
      setEmail("");
      setPhone("");
      setSms(false);
    },
    onError: () => toast.error("Couldn't add you — try again."),
  });

  return (
    <section id="newsletter" className="grain relative scroll-mt-24 overflow-hidden bg-elev py-16 sm:py-24" data-testid="waitlist-section">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(255,215,0,0.12)_0%,transparent_55%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono2 text-xs uppercase tracking-[0.3em] text-gold">The List</p>
          <h2 className="display-graffiti mt-3 font-heading text-3xl font-bold uppercase tracking-tighter text-white sm:text-4xl lg:text-5xl">
            Pop-Up Alerts
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
            We announce every pop-up to the list before it hits the street — the date, the spot, and what's coming off
            the griddle. Add your number and we'll text you the morning of.
          </p>
          <ul className="mt-6 space-y-2 font-mono2 text-[11px] uppercase tracking-wider text-slate-500">
            <li>★ First look at new lumpia drops</li>
            <li>★ Each week's menu before it's public</li>
            <li>★ No spam. Leave any time.</li>
          </ul>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="border-2 border-gold/40 bg-coal/80 p-6 backdrop-blur-sm sm:p-8"
          data-testid="waitlist-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (email) join.mutate();
          }}
        >
          <label className="font-mono2 text-xs uppercase tracking-wider text-slate-300" htmlFor="waitlist-email">
            Email *
          </label>
          <Input
            id="waitlist-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            data-testid="waitlist-email-input"
            className="mt-2 border-white/20 bg-panel text-white"
          />

          <label className="mt-5 block font-mono2 text-xs uppercase tracking-wider text-slate-300" htmlFor="waitlist-phone">
            Mobile (optional)
          </label>
          <Input
            id="waitlist-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(540) 555-0100"
            data-testid="waitlist-phone-input"
            className="mt-2 border-white/20 bg-panel text-white"
          />

          <label className="mt-5 flex items-start gap-3 text-sm text-slate-400">
            <Checkbox
              checked={sms}
              onCheckedChange={(v) => setSms(v === true)}
              data-testid="waitlist-sms-checkbox"
              className="mt-0.5 border-gold data-[state=checked]:bg-gold data-[state=checked]:text-black"
            />
            <span>
              <MessageSquare className="mr-1 inline h-3.5 w-3.5 text-gold" />
              Text me pop-up alerts. Message rates may apply — reply STOP to quit.
            </span>
          </label>

          <button
            type="submit"
            disabled={join.isPending}
            data-testid="waitlist-submit-btn"
            className="sticker mt-7 w-full rotate-[-1deg] bg-flame px-6 py-4 text-sm text-white transition-transform hover:-translate-y-1 hover:rotate-0 disabled:opacity-60"
          >
            <Bell className="mr-2 inline h-4 w-4" />
            {join.isPending ? "Adding you…" : "Get Pop-Up Alerts"}
          </button>
        </motion.form>
      </div>
    </section>
  );
};
