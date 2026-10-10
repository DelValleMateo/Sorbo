import { ChatIcon, StoreIcon, TagIcon, TruckIcon } from "@/components/ui/icons";

const ITEMS = [
  { Icon: TruckIcon, title: "Envío a domicilio", text: "Te lo llevamos a casa" },
  { Icon: StoreIcon, title: "Retiro en el local", text: "Sin cargo" },
  { Icon: TagIcon, title: "Pagá como quieras", text: "Efectivo, transferencia o tarjeta" },
  { Icon: ChatIcon, title: "Pedí por WhatsApp", text: "Te respondemos al toque" },
] as const;

/** Franja de beneficios: angosta, en una línea desde tablet, con divisores en tono topo. */
export function TrustStrip() {
  return (
    <section aria-label="Beneficios de comprar en Sorbo" className="border-b border-gold-deep/40 bg-papel">
      <ul className="wrap grid grid-cols-2 gap-x-4 gap-y-2 py-3.5 md:grid-cols-4 md:gap-0 md:py-4">
        {ITEMS.map(({ Icon, title, text }, i) => (
          <li
            key={title}
            className={`flex min-h-11 items-center gap-3 md:justify-center md:px-4 ${
              i > 0 ? "md:border-l md:border-gold-deep/35" : ""
            }`}
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wine text-gold"
            >
              <Icon width={18} height={18} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-extrabold text-ink md:text-[15px]">{title}</span>
              <span className="hidden text-[13px] text-muted lg:block">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
