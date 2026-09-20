import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SiInstagram, SiFacebook, SiTiktok } from "@icons-pack/react-simple-icons";
import { apiPost } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { FilipinoSunIcon } from "@/components/FilipinoSunIcon";
import { NAV_LINKS } from "@/components/Header";
import { EMAIL, INSTAGRAM, PHONE_DISPLAY, PHONE_TEL } from "@/data/menu";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const mutation = useMutation({
    mutationFn: () => apiPost("/inquiries", { type: "newsletter", name: "Newsletter", email, message: "Newsletter signup for secret menu drops" }),
    onSuccess: () => {
      toast.success("You're on the drop list. Watch your inbox.");
      setEmail("");
    },
    onError: () => toast.error("Could not add you — try again."),
  });

  return (
    <footer className="relative overflow-hidden border-t-4 border-gold bg-coal pb-28 pt-16 lg:pb-16" data-testid="site-footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="outline-text whitespace-nowrap font-heading text-[13vw] font-bold uppercase leading-none tracking-tighter" aria-hidden="true">
          Kayo Mestiza
        </p>
        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-gold"><FilipinoSunIcon className="h-6 w-6" /></span>
              <span className="font-heading font-bold uppercase">Kayo Mestiza</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">Blasian fire &amp; street eats. Rolled, smashed, and charred in the Bay.</p>
            <div className="mt-4 flex gap-3">
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Instagram" data-testid="footer-social-instagram" className="text-slate-400 hover:text-gold"><SiInstagram className="h-5 w-5" /></a>
              <a href="https://facebook.com/kayomestiza" target="_blank" rel="noreferrer" aria-label="Facebook" data-testid="footer-social-facebook" className="text-slate-400 hover:text-gold"><SiFacebook className="h-5 w-5" /></a>
              <a href="https://tiktok.com/@kayomestiza" target="_blank" rel="noreferrer" aria-label="TikTok" data-testid="footer-social-tiktok" className="text-slate-400 hover:text-gold"><SiTiktok className="h-5 w-5" /></a>
            </div>
          </div>
          <div>
            <h3 className="font-mono2 text-xs uppercase tracking-[0.25em] text-gold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.slice(1, 6).map((l) => (
                <li key={l.href}>
                  <a href={l.href} data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-slate-400 underline-offset-4 hover:text-gold hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-mono2 text-xs uppercase tracking-wider text-slate-500">
              <a href={PHONE_TEL} className="hover:text-gold" data-testid="footer-phone-link">{PHONE_DISPLAY}</a>
              <br />
              <a href={`mailto:${EMAIL}`} className="hover:text-gold" data-testid="footer-email-link">{EMAIL}</a>
            </p>
          </div>
          <div>
            <h3 className="font-mono2 text-xs uppercase tracking-[0.25em] text-gold">Secret Menu Drops</h3>
            <p className="mt-4 text-sm text-slate-400">Weekend specials and sticker drops, straight to your inbox.</p>
            <form
              id="newsletter"
              className="mt-4 flex gap-2 scroll-mt-24"
              data-testid="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (email) mutation.mutate();
              }}
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                data-testid="newsletter-email-input"
                className="border-white/20 bg-panel text-white"
              />
              <button type="submit" data-testid="newsletter-submit-btn" className="sticker shrink-0 bg-scarlet px-4 py-2 text-xs text-white">
                Join
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="font-mono2 text-[11px] uppercase tracking-wider text-slate-500">&copy; 2026 Kayo Mestiza. All fire reserved.</p>
          <p className="flex items-center gap-2 font-mono2 text-[11px] uppercase tracking-wider text-slate-500">
            <span className="inline-block h-3 w-5 bg-deepblue" />
            <span className="inline-block h-3 w-5 bg-scarlet" />
            <span className="inline-block h-3 w-5 bg-gold" />
            Proudly Filipino-American
          </p>
        </div>
      </div>
    </footer>
  );
};
