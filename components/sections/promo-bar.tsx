import Link from "next/link";
import { Countdown } from "@/components/sections/countdown";

/** Franja de la promo semanal: arriba del hero, así el hero queda limpio. */
export function PromoBar() {
  return (
    <aside aria-label="Promo semanal" className="focus-dark border-b border-gold/25 bg-wine-deep text-cream">
      <div className="wrap flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-2.5">
        <Countdown />
        <Link
          href="/combos"
          className="inline-flex min-h-11 items-center text-sm font-bold text-cream underline underline-offset-4 hover:text-gold"
        >
          Ver combos en promo
        </Link>
      </div>
    </aside>
  );
}
