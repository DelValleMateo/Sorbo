"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/sections/section-heading";
import { CategorySelect } from "@/components/ui/category-select";
import { ProductCard } from "@/components/ui/product-card";
import { SeeMore } from "@/components/ui/see-more";
import { CATEGORIES } from "@/data/categories";
import { SELLABLES } from "@/lib/catalog";
import { useUi } from "@/lib/ui-store";

const PREVIEW = 8;

const COUNTS = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, SELLABLES.filter((s) => s.cat === c.id).length]),
);

export function CatalogSection() {
  const [cat, setCat] = useState("todo");
  const announce = useUi((s) => s.announce);

  const all = cat === "todo" ? SELLABLES : SELLABLES.filter((s) => s.cat === cat);
  const shown = all.slice(0, PREVIEW);
  const label = CATEGORIES.find((c) => c.id === cat)?.label ?? "Todo";
  const href = cat === "todo" ? "/productos" : `/productos?cat=${cat}`;

  const onChange = (v: string) => {
    if (!v) return;
    setCat(v);
    const n = v === "todo" ? SELLABLES.length : SELLABLES.filter((s) => s.cat === v).length;
    const l = CATEGORIES.find((c) => c.id === v)?.label ?? "Todo";
    announce(`${n} productos en ${l}.`);
  };

  return (
    <section id="catalogo" aria-labelledby="catalogo-title" className="focus-dark scroll-mt-20 bg-felpa text-cream">
      <div className="wrap flex flex-col gap-8 py-16 md:py-20">
        <SectionHeading
          id="catalogo-title"
          eyebrow="Catálogo"
          title="Elegí por categoría"
          description="Del vino de todos los días al whisky para regalar, con todo lo que necesitás para el trago."
          tone="dark"
          action={{ href, label: "Ver catálogo completo" }}
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] text-cream">
            Mostrando <strong>{shown.length}</strong> de <strong>{all.length}</strong> · {label}
          </p>
          <CategorySelect
            value={cat}
            onValueChange={onChange}
            counts={COUNTS}
            total={SELLABLES.length}
            className="inline-flex w-full shadow-soft sm:w-72"
          />
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {shown.map((it) => (
            <li key={it.id} className="flex">
              <ProductCard item={it} />
            </li>
          ))}
        </ul>

        <SeeMore href={href} tone="dark">
          {all.length > PREVIEW
            ? `Ver los ${all.length} productos${cat === "todo" ? "" : ` de ${label}`}`
            : "Ver catálogo completo"}
        </SeeMore>
      </div>
    </section>
  );
}
