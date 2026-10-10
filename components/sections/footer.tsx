import Link from "next/link";
import { ChatIcon } from "@/components/ui/icons";
import { IMAGE_SOURCE } from "@/data/images";
import { SITE } from "@/lib/config";
import { whatsappUrl } from "@/lib/order";

const COLUMNS = [
  {
    title: "Navegación",
    links: [
      { href: "/", label: "Inicio" },
      { href: "/productos?cat=tintos,blancos,espumantes", label: "Vinos" },
      { href: "/combos", label: "Combos" },
      { href: "/productos", label: "Catálogo" },
    ],
  },
  {
    title: "Categorías",
    links: [
      { href: "/productos?cat=tintos", label: "Tintos" },
      { href: "/productos?cat=blancos", label: "Blancos y rosados" },
      { href: "/productos?cat=espumantes", label: "Espumantes" },
      { href: "/productos?cat=whisky", label: "Whisky" },
      { href: "/productos?cat=destilados", label: "Gin, vodka y ron" },
    ],
  },
] as const;

const headingCls = "mb-4 text-[13px] font-bold uppercase tracking-[0.2em] text-gold";
const linkCls =
  "inline-flex min-h-9 items-center text-[15px] text-cream no-underline underline-offset-4 hover:text-gold hover:underline";

export function Footer() {
  return (
    <footer className="focus-dark mt-auto overflow-hidden border-t border-gold/50 bg-felpa text-cream">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 pb-10 pt-14 lg:grid-cols-4 lg:gap-x-10">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-labelledby={`footer-${col.title}`}>
              <h2 id={`footer-${col.title}`} className={headingCls}>
                {col.title}
              </h2>
              <ul className="flex flex-col gap-1">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkCls}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className={headingCls}>Comprá fácil</h2>
            <ul className="flex flex-col gap-2 text-[15px] leading-snug">
              <li>Envío a domicilio</li>
              <li>Retiro en el local sin cargo</li>
              <li>Efectivo o transferencia; tarjeta y QR retirando en el local</li>
              <li>
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 flex-wrap items-center gap-x-1 font-bold text-cream underline underline-offset-4 hover:text-gold"
                >
                  WhatsApp <span className="whitespace-nowrap">{SITE.whatsappLabel}</span>
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={headingCls}>Sorbo</h2>
            <div className="flex flex-col gap-2 text-[15px] leading-snug">
              <p className="font-bold">{SITE.legal}</p>
              <p className="text-sm">
                Fotos:{" "}
                <a
                  href={IMAGE_SOURCE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream underline underline-offset-4 hover:text-gold"
                >
                  {IMAGE_SOURCE.name}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
                , con autorización.
              </p>
              <a
                href={whatsappUrl("¡Hola Sorbo! Necesito una recomendación.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-11 w-fit items-center gap-2.5 rounded-full bg-cream py-1.5 pl-1.5 pr-4 text-sm font-bold text-wine no-underline transition-colors hover:bg-gold hover:text-ink"
              >
                <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-wine text-cream">
                  <ChatIcon width={16} height={16} />
                </span>
                Pedí una recomendación
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Marca gigante al pie: decorativa (el nombre ya figura arriba) */}
        <div aria-hidden="true" className="relative border-t border-cream/20 pt-[5cqw] @container">
          <p className="select-none whitespace-nowrap text-center font-serif text-[42.5cqw] font-medium leading-[0.74] tracking-[-0.045em] text-cream">
            Sorbo
          </p>
        </div>
      </div>
    </footer>
  );
}
