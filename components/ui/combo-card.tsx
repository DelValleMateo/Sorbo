import Image from "next/image";
import { AddToCart } from "@/components/ui/add-to-cart";
import { Price } from "@/components/ui/price";
import { formatPrice } from "@/lib/format";
import { discountPct, type Sellable } from "@/lib/catalog";

const SIZES = "(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw";

/**
 * Tarjeta de combo: muestra qué trae (lista escaneable, no un texto corrido),
 * cuánto se ahorra y el precio final. El id permite enlazar desde el hero (/combos#combo-asado).
 */
export function ComboCard({ item, anchor = false }: { item: Sellable; anchor?: boolean }) {
  const save = (item.oldPrice ?? item.price) - item.price;
  const off = discountPct(item.price, item.oldPrice);
  return (
    <article
      id={anchor ? item.slug : undefined}
      aria-labelledby={`${item.id}-title`}
      className="group flex h-full w-full scroll-mt-28 flex-col overflow-hidden rounded-2xl bg-cream text-ink shadow-soft ring-1 ring-black/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-hero target:ring-4 target:ring-gold motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-white">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes={SIZES}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
        {save > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-wine px-2.5 py-1.5 text-sm font-extrabold text-cream">
            Ahorrás {formatPrice(save)}
          </span>
        )}
        {off > 0 && (
          <span className="absolute right-3 top-3 rounded-md bg-gold px-2 py-1.5 text-sm font-extrabold text-ink">
            −{off}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 id={`${item.id}-title`} className="font-serif text-2xl font-medium leading-tight tracking-tight">
          {item.name}
        </h3>
        <div>
          <p className="sr-only">Incluye:</p>
          <ul className="flex flex-col gap-1.5">
            {item.detail.split(" + ").map((it) => (
              <li key={it} className="flex items-start gap-2.5 text-[15px] text-ink-soft">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-deep" />
                {it}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-line-soft pt-4">
          <Price price={item.price} oldPrice={item.oldPrice} className="text-2xl" stacked />
          <AddToCart item={item} />
        </div>
      </div>
    </article>
  );
}
