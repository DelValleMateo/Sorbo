import { SectionHeading } from "@/components/sections/section-heading";
import { ComboCard } from "@/components/ui/combo-card";
import { SeeMore } from "@/components/ui/see-more";
import { COMBO_SELLABLES } from "@/lib/catalog";

const PREVIEW = 6;

export function CombosSection() {
  const shown = COMBO_SELLABLES.slice(0, PREVIEW);
  const total = COMBO_SELLABLES.length;
  return (
    <section
      id="combos"
      aria-labelledby="combos-title"
      className="scroll-mt-20 border-y border-gold-deep/40 bg-papel"
    >
      <div className="wrap flex flex-col gap-10 py-16 md:py-20">
        <SectionHeading
          id="combos-title"
          eyebrow="Combos"
          title="Armados para cada ocasión"
          description="Todo junto sale menos que por separado. Elegí el tuyo y sumalo al pedido."
          action={{ href: "/combos", label: `Ver los ${total} combos` }}
        />
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => (
            <li key={c.id} className="flex">
              <ComboCard item={c} />
            </li>
          ))}
        </ul>
        <SeeMore href="/combos">Ver todos los combos ({total})</SeeMore>
      </div>
    </section>
  );
}
