import Image from "next/image";
import Link from "next/link";
import { AddToCart } from "@/components/ui/add-to-cart";
import { Price } from "@/components/ui/price";
import { StockBadge } from "@/components/ui/stock-badge";
import { categoryLabel } from "@/data/categories";
import { discountPct, type Sellable } from "@/lib/catalog";

const SIZES = "(min-width: 1280px) 280px, (min-width: 768px) 33vw, 50vw";

export const itemHref = (item: Sellable) =>
  item.kind === "combo" ? `/combos#${item.slug}` : `/productos/${item.slug}`;

/**
 * Tarjeta de producto. Toda la tarjeta lleva a la ficha (enlace "estirado" sobre el
 * título) y el botón de agregar queda por encima, así no se pisan las acciones.
 */
export function ProductCard({ item, headingLevel = 3 }: { item: Sellable; headingLevel?: 2 | 3 }) {
  const off = discountPct(item.price, item.oldPrice);
  const isCombo = item.kind === "combo";
  const H = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-cream text-ink shadow-soft ring-1 ring-black/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-hero motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[4/5] overflow-hidden bg-white">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes={SIZES}
          className={`object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none ${
            item.stock === "out" ? "opacity-60 grayscale" : ""
          }`}
        />
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {off > 0 && (
            <span className="rounded-md bg-wine px-2 py-1 text-xs font-extrabold text-cream">
              −{off}% OFF
            </span>
          )}
          {isCombo && (
            <span className="rounded-md bg-gold px-2 py-1 text-xs font-extrabold text-ink">Combo</span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-wine">
          {isCombo ? "Combo" : categoryLabel(item.cat)}
        </span>
        <H className="font-serif text-lg font-medium leading-tight tracking-tight sm:text-xl">
          <Link
            href={itemHref(item)}
            className="text-ink no-underline after:absolute after:inset-0 after:rounded-2xl after:content-[''] hover:text-wine focus-visible:shadow-none focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-offset-[-3px] focus-visible:after:outline-ink"
          >
            {item.name}
          </Link>
        </H>
        <p className="text-sm text-muted">{item.detail}</p>
        <StockBadge stock={item.stock} />

        <div className="mt-auto flex flex-col gap-2.5 pt-3">
          <Price price={item.price} oldPrice={item.oldPrice} className="text-lg sm:text-xl" />
          {/* z-10: por encima del enlace estirado */}
          <div className="relative z-10">
            <AddToCart item={item} className="w-full" />
          </div>
        </div>
      </div>
    </article>
  );
}
