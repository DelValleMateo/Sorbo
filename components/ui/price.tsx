import { formatPrice } from "@/lib/format";

interface Props {
  price: number;
  oldPrice?: number;
  className?: string;
  oldClassName?: string;
  /** Precio anterior arriba del actual (bloques de precio destacados) */
  stacked?: boolean;
}

/** Precio actual + precio anterior tachado, con etiquetas para lectores de pantalla. */
export function Price({ price, oldPrice, className = "", oldClassName = "", stacked = false }: Props) {
  const old = oldPrice ? (
    <span className={`text-sm font-semibold text-muted-2 line-through ${oldClassName}`}>
      <span className="sr-only">Precio anterior: </span>
      {formatPrice(oldPrice)}
    </span>
  ) : null;

  return (
    <span
      className={`flex ${stacked ? "flex-col items-start gap-0.5" : "flex-wrap items-baseline gap-x-2"}`}
    >
      {stacked && old}
      <span className={`font-extrabold tracking-tight ${className}`}>
        <span className="sr-only">Precio: </span>
        {formatPrice(price)}
      </span>
      {!stacked && old}
    </span>
  );
}
