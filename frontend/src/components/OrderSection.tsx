import { Flame, MessageSquareText, Phone } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useContact } from "@/hooks/useSettings";

export const OrderSection = () => {
  const contact = useContact();
  return (
  <section id="order" className="relative overflow-hidden bg-scarlet py-20 sm:py-28" data-testid="order-section">
    <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:repeating-linear-gradient(-45deg,#000_0_2px,transparent_2px_18px)]" />
    <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
      <Reveal>
        <p className="font-mono2 text-xs uppercase tracking-[0.3em] text-gold">Skip the Line</p>
        <h2 className="display-graffiti-gold mt-4 font-heading text-4xl font-bold uppercase tracking-tighter text-white sm:text-5xl lg:text-6xl">
          Hungry Now?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-red-100">
          Call or text your order ahead, roll up to the truck window, and we hand you the fire. Pickup only at the truck — no delivery apps, no middlemen.
        </p>
        <a
          href={contact.tel}
          data-testid="order-phone-display"
          className="mt-8 block font-heading text-4xl font-bold tracking-tight text-gold transition-transform hover:scale-[1.02] sm:text-6xl"
        >
          {contact.phone_display}
        </a>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href={contact.tel} data-testid="order-call-btn" className="sticker bg-gold px-8 py-4 text-sm text-black transition-transform hover:-translate-y-1 hover:rotate-1">
            <Phone className="mr-2 inline h-4 w-4" /> Call to Order
          </a>
          <a href={contact.sms} data-testid="order-text-btn" className="sticker bg-black px-8 py-4 text-sm text-white transition-transform hover:-translate-y-1 hover:-rotate-1">
            <MessageSquareText className="mr-2 inline h-4 w-4" /> Text Your Order
          </a>
        </div>
        <p className="mt-6 inline-flex items-center gap-2 font-mono2 text-xs uppercase tracking-[0.2em] text-red-200">
          <Flame className="h-4 w-4 text-gold" /> Have your location + menu items ready
        </p>
      </Reveal>
    </div>
  </section>
  );
};
