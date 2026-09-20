import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiInstagram, SiFacebook, SiTiktok } from "@icons-pack/react-simple-icons";
import { apiPost, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/Reveal";
import { useContact } from "@/hooks/useSettings";

export const ContactSection = () => {
  const contact = useContact();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const mutation = useMutation({
    mutationFn: () => apiPost("/inquiries", { type: "contact", ...form }),
    onSuccess: () => {
      toast.success("Message sent! We read everything between services.");
      setForm({ name: "", email: "", message: "" });
    },
    onError: (e) => {
      toast.error(e instanceof ApiError ? "Could not send — check your details and try again." : "Network error, try again.");
    },
  });

  return (
    <section id="contact" className="bg-panel/40 py-20 sm:py-28" data-testid="contact-section">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <p className="font-mono2 text-xs uppercase tracking-[0.3em] text-gold">Holler at the Truck</p>
          <h2 className="display-graffiti mt-3 font-heading text-3xl font-bold uppercase tracking-tighter text-white sm:text-4xl lg:text-5xl">
            Contact
          </h2>
          <div className="mt-8 space-y-4">
            <a href={contact.tel} data-testid="contact-phone-link" className="flex items-center gap-3 text-lg text-slate-200 hover:text-gold">
              <span className="sticker bg-flame p-2 text-white"><Phone className="h-4 w-4" /></span> {contact.phone_display}
            </a>
            <a href={contact.mailto} data-testid="contact-email-link" className="flex items-center gap-3 text-lg text-slate-200 hover:text-gold">
              <span className="sticker bg-deepblue p-2 text-white"><Mail className="h-4 w-4" /></span> {contact.email}
            </a>
            <p className="flex items-center gap-3 text-lg text-slate-200">
              <span className="sticker bg-gold p-2 text-black"><MapPin className="h-4 w-4" /></span> Fredericksburg, VA
            </p>
          </div>
          <div className="mt-8 flex gap-3" data-testid="contact-socials">
            {contact.instagram && (
              <a href={contact.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" data-testid="social-instagram" className="sticker rotate-[-2deg] bg-scarlet p-3 text-white transition-transform hover:rotate-0">
                <SiInstagram className="h-5 w-5" />
              </a>
            )}
            {contact.facebook && (
              <a href={contact.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" data-testid="social-facebook" className="sticker rotate-2 bg-deepblue p-3 text-white transition-transform hover:rotate-0">
                <SiFacebook className="h-5 w-5" />
              </a>
            )}
            {contact.tiktok && (
              <a href={contact.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" data-testid="social-tiktok" className="sticker rotate-[-1deg] bg-black p-3 text-white transition-transform hover:rotate-0">
                <SiTiktok className="h-5 w-5" />
              </a>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <form
            data-testid="contact-form"
            className="grid gap-5 border-2 border-white/10 bg-coal p-6 sm:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
          >
            <div>
              <Label htmlFor="contact-name" className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Name *</Label>
              <Input id="contact-name" data-testid="contact-name-input" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-2 border-white/20 bg-panel text-white" placeholder="Your name" />
            </div>
            <div>
              <Label htmlFor="contact-email" className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Email *</Label>
              <Input id="contact-email" data-testid="contact-email-input" required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="mt-2 border-white/20 bg-panel text-white" placeholder="you@email.com" />
            </div>
            <div>
              <Label htmlFor="contact-message" className="font-mono2 text-xs uppercase tracking-wider text-slate-300">Message *</Label>
              <Textarea id="contact-message" data-testid="contact-message-input" required rows={4} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="mt-2 border-white/20 bg-panel text-white" placeholder="What's good?" />
            </div>
            <Button type="submit" data-testid="contact-submit-btn" disabled={mutation.isPending} className="sticker h-auto w-fit rotate-1 bg-gold px-8 py-4 font-heading text-sm text-black hover:bg-flame hover:text-white">
              {mutation.isPending ? "Sending…" : "Send Message"}
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
};
