import { useState } from "react";
import { Flame, Menu as MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FilipinoSunIcon } from "@/components/FilipinoSunIcon";
import { useContact } from "@/hooks/useSettings";

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "Truck Schedule", href: "#schedule" },
  { label: "Order", href: "#order" },
  { label: "Catering", href: "#catering" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const contact = useContact();
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-coal/85 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]" data-testid="site-header">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#home" className="flex items-center gap-2" data-testid="header-logo-link">
          <span className="text-gold"><FilipinoSunIcon className="h-8 w-8" /></span>
          <span className="font-heading text-lg font-bold tracking-tight uppercase">
            Kayo <span className="text-flame">Mestiza</span>
          </span>
        </a>
        <nav className="hidden items-center gap-6 lg:flex" data-testid="header-nav-desktop">
          {NAV_LINKS.slice(1).map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="font-mono2 text-xs uppercase tracking-[0.18em] text-slate-300 transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <a
            href={contact.tel}
            data-testid="nav-order-now-btn"
            className="sticker rotate-[-2deg] bg-scarlet px-4 py-2 text-xs text-white transition-transform hover:rotate-0 hover:scale-105"
          >
            <Flame className="mr-1 inline h-3.5 w-3.5" /> Order Now
          </a>
        </nav>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            data-testid="nav-mobile-menu-btn"
            className="inline-flex h-10 w-10 items-center justify-center border-2 border-white/20 bg-panel text-white lg:hidden"
            aria-label="Open menu"
          >
            <MenuIcon className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="border-l-4 border-gold bg-coal text-white" data-testid="nav-mobile-drawer">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 font-heading uppercase text-white">
                <span className="text-gold"><FilipinoSunIcon className="h-6 w-6" /></span>
                Kayo Mestiza
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1" data-testid="header-nav-mobile">
              {NAV_LINKS.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  data-testid={`nav-mobile-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`sticker px-4 py-3 text-sm ${i % 3 === 0 ? "bg-gold text-black" : i % 3 === 1 ? "bg-scarlet text-white" : "bg-deepblue text-white"} ${i % 2 ? "rotate-1" : "-rotate-1"}`}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
