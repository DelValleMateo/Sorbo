import type { Metadata } from "next";
import Link from "next/link";
import { SearchForm } from "@/components/ui/search-form";
import { btn } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="focus-dark relative overflow-hidden bg-velvet text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_30%,color-mix(in_srgb,var(--color-wine-light)_45%,transparent),transparent_70%)]"
      />
      <div className="wrap relative flex min-h-[70svh] flex-col items-center justify-center gap-5 py-20 text-center">
        <p aria-hidden="true" className="font-serif text-[clamp(88px,16vw,180px)] font-medium leading-none text-gold">
          404
        </p>
        <h1 id="nf-title" className="font-serif text-h1 font-medium">
          Esta página se quedó sin stock
        </h1>
        <p className="max-w-md text-base leading-relaxed md:text-lg">
          El enlace puede estar roto o la página ya no existe. Buscá lo que necesitás o volvé a la tienda.
        </p>
        <div className="w-full max-w-sm text-left">
          <SearchForm id="buscar-404" />
        </div>
        <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/" className={btn("light", "lg")}>
            Ir al inicio
          </Link>
          <Link href="/productos" className={btn("outline-light", "lg")}>
            Ver el catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}
