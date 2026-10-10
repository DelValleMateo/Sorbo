"use client";

import { MinusIcon, PlusIcon, XCircleIcon } from "@/components/ui/icons";
import { useCart } from "@/lib/cart-store";
import type { Sellable } from "@/lib/catalog";
import { useUi } from "@/lib/ui-store";

interface Props {
  item: Sellable;
  /** solid: CTA principal · outline: acción secundaria */
  variant?: "outline" | "solid";
  size?: "md" | "lg";
  className?: string;
  /** Texto del botón cuando todavía no está en el pedido */
  label?: string;
}

/**
 * Botón "Agregar" que, una vez en el pedido, se convierte en un selector de cantidad.
 * Cada cambio se anuncia en la región aria-live global.
 */
export function AddToCart({
  item,
  variant = "solid",
  size = "md",
  className = "",
  label = "Agregar",
}: Props) {
  const qty = useCart((s) => s.items[item.id] ?? 0);
  const add = useCart((s) => s.add);
  const dec = useCart((s) => s.dec);
  const announce = useUi((s) => s.announce);
  const h = size === "lg" ? "h-12" : "h-11";

  if (item.stock === "out") {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex ${h} items-center justify-center gap-2 rounded-lg border border-line-strong bg-sand px-4 text-sm font-bold text-muted-2 ${className}`}
      >
        <XCircleIcon width={16} height={16} />
        Sin stock
      </button>
    );
  }

  const onAdd = () => {
    add(item.id);
    announce(`${item.name} agregado al pedido. Cantidad: ${qty + 1}.`);
  };
  const onDec = () => {
    dec(item.id);
    announce(qty > 1 ? `${item.name}: cantidad ${qty - 1}.` : `${item.name} quitado del pedido.`);
  };

  if (qty === 0) {
    const look =
      variant === "solid"
        ? "bg-wine text-cream shadow-btn hover:bg-wine-dark"
        : "border border-wine bg-transparent text-wine hover:bg-wine hover:text-cream";
    return (
      <button
        type="button"
        onClick={onAdd}
        aria-label={`${label}: ${item.name}`}
        className={`inline-flex ${h} items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-bold transition-colors active:scale-[.98] motion-reduce:transition-none ${look} ${className}`}
      >
        <PlusIcon width={16} height={16} />
        {label}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={`Cantidad de ${item.name} en el pedido`}
      className={`inline-flex ${h} items-center justify-between rounded-lg border border-wine bg-cream text-wine ${className}`}
    >
      <button
        type="button"
        onClick={onDec}
        aria-label={`Quitar una unidad de ${item.name}`}
        className={`inline-flex ${h} w-11 items-center justify-center rounded-lg hover:bg-wine-tint`}
      >
        <MinusIcon width={18} height={18} />
      </button>
      <span className="min-w-8 text-center text-[15px] font-extrabold tabular-nums">
        <span className="sr-only">Cantidad: </span>
        {qty}
      </span>
      <button
        type="button"
        onClick={onAdd}
        aria-label={`Sumar una unidad de ${item.name}`}
        className={`inline-flex ${h} w-11 items-center justify-center rounded-lg hover:bg-wine-tint`}
      >
        <PlusIcon width={18} height={18} />
      </button>
    </div>
  );
}
