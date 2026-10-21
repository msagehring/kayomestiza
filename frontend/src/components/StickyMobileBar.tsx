import { Flame, MapPin } from "lucide-react";
import { useContact } from "@/hooks/useSettings";

export const StickyMobileBar = () => {
  const contact = useContact();
  return (
  <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-gold bg-coal/95 backdrop-blur-xl lg:hidden" data-testid="sticky-mobile-bar">
    <div className="grid grid-cols-2 gap-2 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <a href={contact.tel} data-testid="sticky-order-btn" className="sticker flex items-center justify-center gap-2 bg-flame px-4 py-3 text-xs text-white">
        <Flame className="h-4 w-4" /> Order Now
      </a>
      <a href="#schedule" data-testid="sticky-find-truck-btn" className="sticker flex items-center justify-center gap-2 bg-deepblue px-4 py-3 text-xs text-white">
        <MapPin className="h-4 w-4" /> Delivery Area
      </a>
    </div>
  </div>
  );
};
