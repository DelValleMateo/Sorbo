import { CatalogSection } from "@/components/sections/catalog-section";
import { CombosSection } from "@/components/sections/combos-section";
import { Hero } from "@/components/sections/hero";
import { HowToOrder } from "@/components/sections/how-to-order";
import { Occasions } from "@/components/sections/occasions";
import { PromoBar } from "@/components/sections/promo-bar";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustStrip } from "@/components/sections/trust-strip";
import { WineTiles } from "@/components/sections/wine-tiles";

/**
 * Home v2: alterna cuero bordó y cuero crema.
 * Promo → Hero animado → Beneficios → Ocasiones → Combos → Vinoteca → Catálogo → Cómo pedir → Clientes
 */
export default function HomePage() {
  return (
    <>
      <PromoBar />
      <Hero />
      <TrustStrip />
      <Occasions />
      <CombosSection />
      <WineTiles />
      <CatalogSection />
      <HowToOrder />
      <Testimonials />
    </>
  );
}
