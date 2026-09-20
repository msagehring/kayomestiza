import { useEffect } from "react";
import Lenis from "lenis";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MarqueeBanner } from "@/components/MarqueeBanner";
import { DropCountdown } from "@/components/DropCountdown";
import { FanFavorites } from "@/components/FanFavorites";
import { MenuSection } from "@/components/MenuSection";
import { ScheduleSection } from "@/components/ScheduleSection";
import { OrderSection } from "@/components/OrderSection";
import { CateringSection } from "@/components/CateringSection";
import { AboutManifesto } from "@/components/AboutManifesto";
import { GallerySection } from "@/components/GallerySection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { StickyMobileBar } from "@/components/StickyMobileBar";

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, anchors: true });
    return () => lenis.destroy();
  }, []);

  return (
    <div className="min-h-screen bg-coal text-white">
      <Header />
      <main>
        <Hero />
        <MarqueeBanner />
        <DropCountdown />
        <FanFavorites />
        <MenuSection />
        <ScheduleSection />
        <OrderSection />
        <CateringSection />
        <AboutManifesto />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
      <StickyMobileBar />
    </div>
  );
}
