import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/page-header";
import { ComboCard } from "@/components/ui/combo-card";
import { COMBO_SELLABLES } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Combos",
  description: "Combos armados para cada ocasión. Todo junto sale menos que por separado.",
};

export default function CombosPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Inicio", href: "/" }, { label: "Combos" }]}
        title="Combos para cada ocasión"
        description="Asado, brindis, previa o cata: armamos todo lo que necesitás y sale menos que por separado."
      />
      <div className="bg-papel">
        <div className="wrap py-10 md:py-14">
          <h2 className="sr-only">Todos los combos</h2>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {COMBO_SELLABLES.map((c) => (
              <li key={c.id} className="flex">
                <ComboCard item={c} anchor />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
