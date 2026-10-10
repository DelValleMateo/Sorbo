import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/sections/section-heading";
import { ArrowIcon } from "@/components/ui/icons";
import { SeeMore } from "@/components/ui/see-more";
import { PRODUCTS } from "@/data/products";
import { formatPrice } from "@/lib/format";

const TILES = [
  { id: "tintos", label: "Tintos", note: "Malbec, Cabernet, Bonarda y blends", image: "/images/tiles/tintos.webp" },
  { id: "blancos", label: "Blancos y rosados", note: "Torrontés, Sauvignon Blanc, Chardonnay", image: "/images/tiles/blancos.webp" },
  { id: "espumantes", label: "Espumantes", note: "Extra Brut, Brut Nature y dulces", image: "/images/tiles/espumantes.webp" },
] as const;

const WINE_CATS = TILES.map((t) => t.id).join(",");

export function WineTiles() {
  return (
    <section id="vinos" aria-labelledby="vinos-title" className="focus-dark scroll-mt-20 bg-felpa text-cream">
      <div className="wrap flex flex-col gap-10 py-16 md:py-20">
        <SectionHeading
          id="vinos-title"
          eyebrow="La vinoteca"
          title="Elegí tu vino"
          description="Etiquetas de bodegas argentinas para el día a día y para regalar."
          tone="dark"
          action={{ href: `/productos?cat=${WINE_CATS}`, label: "Ver todos los vinos" }}
        />
        <ul className="grid grid-cols-3 gap-3 md:gap-6">
          {TILES.map((t) => {
            const ps = PRODUCTS.filter((p) => p.cat === t.id);
            const from = Math.min(...ps.map((p) => p.price));
            return (
              <li key={t.id} className="flex">
                <Link
                  href={`/productos?cat=${t.id}`}
                  className="group flex w-full flex-col overflow-hidden rounded-2xl bg-cream text-ink no-underline shadow-soft ring-1 ring-gold/20 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:text-ink hover:shadow-hero motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span className="relative block aspect-square w-full overflow-hidden bg-white sm:aspect-[4/3]">
                    <Image
                      src={t.image}
                      alt=""
                      fill
                      sizes="(min-width: 1240px) 380px, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                    />
                  </span>
                  <span className="flex flex-1 flex-col gap-1 p-3 md:p-5">
                    <span className="font-serif text-[clamp(16px,2.3vw,28px)] font-medium leading-tight tracking-tight">
                      {t.label}
                    </span>
                    <span className="hidden text-sm text-muted md:block">{t.note}</span>
                    <span className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2 md:pt-4">
                      <span className="text-xs text-muted sm:text-sm">
                        {ps.length} etiquetas · desde{" "}
                        <strong className="font-extrabold text-ink">{formatPrice(from)}</strong>
                      </span>
                      <span
                        aria-hidden="true"
                        className="hidden h-9 w-9 items-center justify-center rounded-full bg-wine text-cream transition-transform group-hover:translate-x-1 motion-reduce:transition-none md:inline-flex"
                      >
                        <ArrowIcon width={16} height={16} />
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <SeeMore href={`/productos?cat=${WINE_CATS}`} tone="dark">
          Ver todos los vinos
        </SeeMore>
      </div>
    </section>
  );
}
