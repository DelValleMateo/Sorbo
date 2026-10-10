import { CatalogSection } from "@/components/sections/catalog-section";
import { CombosSection } from "@/components/sections/combos-section";
import { Hero } from "@/components/sections/hero";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustStrip } from "@/components/sections/trust-strip";
import { WineTiles } from "@/components/sections/wine-tiles";

/**
 * Home: alterna terciopelo/felpa bordó y marfil.
 * Hero → Beneficios → Vinoteca → Combos → Catálogo → Clientes → (footer con asesoramiento)
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <WineTiles />
      <CombosSection />
      <CatalogSection />
      <Testimonials />
    </>
  );
}
