import Link from "next/link";
import type { SVGProps } from "react";
import { SectionHeading } from "@/components/sections/section-heading";
import { ArrowIcon } from "@/components/ui/icons";

type P = SVGProps<SVGSVGElement>;

const icon = (p: P): P => ({
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
  ...p,
});

const AsadoIcon = (p: P) => (
  <svg {...icon(p)}>
    <path d="M4 11h16l-2 7H6z" />
    <path d="M8 11c0-3 1.5-4 1.5-6M12 11c0-3 1.5-4 1.5-6M16 11c0-3 1.5-4 1.5-6M7 18l-2 3M17 18l2 3" />
  </svg>
);
const BrindisIcon = (p: P) => (
  <svg {...icon(p)}>
    <path d="M6 3h5l-.5 6a2 2 0 0 1-4 0zM8.5 11v8M6.5 19h4" />
    <path d="M13.5 3h5L18 9a2 2 0 0 1-4 0zM16 11v8M14 19h4" />
  </svg>
);
const PreviaIcon = (p: P) => (
  <svg {...icon(p)}>
    <path d="M7 4h10l-1.5 16h-7zM7.5 9h9" />
    <circle cx="10.5" cy="13" r=".6" />
    <circle cx="13" cy="15.5" r=".6" />
  </svg>
);
const CataIcon = (p: P) => (
  <svg {...icon(p)}>
    <path d="M7 3h10c0 5-2 8-5 8s-5-3-5-8zM12 11v9M8 20h8M7.5 6.5h9" />
  </svg>
);

const OCCASIONS = [
  { label: "Asado", note: "Malbec y Bonarda con cuerpo para la carne.", href: "/combos#combo-asado", Icon: AsadoIcon },
  { label: "Brindis", note: "Espumantes bien fríos para levantar la copa.", href: "/combos#combo-brindis", Icon: BrindisIcon },
  { label: "Previa", note: "Fernet, gin tonic o birra, con hielo incluido.", href: "/combos#combo-previa", Icon: PreviaIcon },
  { label: "Cata en casa", note: "Tres etiquetas para comparar y descubrir.", href: "/combos#caja-degustacion", Icon: CataIcon },
] as const;

/** Accesos por ocasión: tarjetas grandes que llevan directo al combo. */
export function Occasions() {
  return (
    <section aria-labelledby="ocasion-title" className="bg-papel">
      {/* Más ancho que el .wrap estándar (1240 px) para que las tarjetas respiren */}
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-[clamp(16px,4vw,40px)] pb-4 pt-16 md:pt-20">
        <SectionHeading
          id="ocasion-title"
          eyebrow="Pedí por ocasión"
          title="¿Qué estás festejando?"
          description="Elegí el plan y te llevamos directo al combo que mejor va."
        />
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {OCCASIONS.map(({ label, note, href, Icon }) => (
            <li key={label} className="flex">
              <Link
                href={href}
                className="group flex w-full flex-col gap-3 rounded-2xl bg-cream p-4 text-ink no-underline shadow-soft ring-1 ring-black/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:text-ink hover:shadow-hero motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-6"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-wine text-cream sm:h-14 sm:w-14">
                  <Icon />
                </span>
                <span className="font-serif text-[clamp(20px,2.2vw,28px)] font-medium leading-tight tracking-tight">
                  {label}
                </span>
                <span className="hidden text-[15px] leading-snug text-muted sm:block">{note}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-bold text-wine">
                  Ver combo
                  <ArrowIcon
                    width={16}
                    height={16}
                    className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
