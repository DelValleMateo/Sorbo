import { SectionHeading } from "@/components/sections/section-heading";
import { ChatIcon } from "@/components/ui/icons";
import { whatsappUrl } from "@/lib/order";

const STEPS = [
  { title: "Armá tu pedido", text: "Sumá vinos, combos o destilados a “Mi pedido”." },
  { title: "Envialo por WhatsApp", text: "El mensaje se arma solo, con el detalle y el total." },
  { title: "Recibilo o retiralo", text: "Te lo llevamos a casa, o pasás por el local sin cargo." },
] as const;

/** Explica el circuito de compra (no es obvio para quien llega por primera vez) y cierra con asesoramiento. */
export function HowToOrder() {
  return (
    <section id="como-pedir" aria-labelledby="como-pedir-title" className="scroll-mt-20 bg-papel">
      <div className="wrap flex flex-col gap-10 py-16 md:py-20">
        <SectionHeading id="como-pedir-title" eyebrow="Cómo pedir" title="Tres pasos y está en tu mesa" />
        <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="flex flex-col gap-3 rounded-2xl bg-cream p-6 shadow-soft ring-1 ring-black/5 md:p-7"
            >
              <span aria-hidden="true" className="font-serif text-5xl italic leading-none text-wine">
                {i + 1}
              </span>
              <h3 className="text-xl font-extrabold text-ink">{s.title}</h3>
              <p className="text-[15px] leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-5 rounded-3xl bg-gold p-7 text-ink shadow-soft md:flex-row md:items-center md:justify-between md:p-10">
          <div className="flex max-w-xl flex-col gap-2">
            <h3 className="font-serif text-[clamp(26px,3vw,36px)] font-medium leading-tight tracking-tight">
              ¿No sabés cuál elegir?
            </h3>
            <p className="text-base leading-relaxed text-ink-soft md:text-lg">
              Contanos la ocasión y el presupuesto, y te recomendamos el vino justo.
            </p>
          </div>
          <a
            href={whatsappUrl("¡Hola Sorbo! Necesito una recomendación.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 shrink-0 items-center justify-center gap-2.5 rounded-lg bg-wine-deep px-7 text-base font-bold text-cream no-underline shadow-cta transition-colors hover:bg-ink hover:text-cream"
          >
            <ChatIcon width={20} height={20} />
            Pedí una recomendación
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
