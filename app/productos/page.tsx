import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/sections/page-header";
import { CatalogFilters } from "@/components/sections/product-filters";
import { SearchIcon } from "@/components/ui/icons";
import { ProductCard } from "@/components/ui/product-card";
import { CATEGORIES } from "@/data/categories";
import { SELLABLES } from "@/lib/catalog";
import { applyFilters, baseItems, parseFilters } from "@/lib/filters";
import { btn } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Vinos, espumantes, cervezas, whisky, fernet, destilados, mixers y combos de Sorbo.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const filters = parseFilters(await searchParams);
  const base = baseItems(SELLABLES, filters);
  const items = applyFilters(SELLABLES, filters);
  const counts = Object.fromEntries(
    CATEGORIES.filter((c) => c.id !== "todo").map((c) => [
      c.id,
      base.filter((i) => i.cat === c.id).length,
    ]),
  );

  return (
    <div className="wrap flex flex-col gap-7 py-8 md:py-10">
      <CatalogFilters filters={filters} total={items.length} counts={counts} allCount={base.length} />

      <div className="flex flex-col gap-6">
        <h2 className="sr-only">Resultados</h2>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-cream px-6 py-12 text-center text-ink shadow-soft">
            <span
              aria-hidden="true"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-wine-tint text-wine"
            >
              <SearchIcon width={28} height={28} />
            </span>
            <h3 className="font-serif text-[28px] font-medium leading-tight">No encontramos productos</h3>
            <p className="max-w-md text-base leading-relaxed text-muted">
              {filters.q
                ? `No hay resultados para “${filters.q}”. Probá con otra palabra o revisá la ortografía.`
                : "Probá con otra categoría o quitá algún filtro para ver más resultados."}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href="/productos" className={btn("primary", "md")}>
                Ver todo el catálogo
              </Link>
              <Link href="/combos" className={btn("outline", "md")}>
                Ver combos
              </Link>
            </div>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {items.map((it) => (
              <li key={it.id} className="flex">
                <ProductCard item={it} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function ProductosPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Inicio", href: "/" }, { label: "Catálogo" }]}
        title="Catálogo"
        description="Vinos, espumantes, cervezas, whisky, fernet, destilados, mixers y combos."
      />
      <div className="focus-dark bg-felpa text-cream">
        <Suspense
          fallback={
            <div className="wrap py-12" role="status">
              Cargando productos…
            </div>
          }
        >
          <Results searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
