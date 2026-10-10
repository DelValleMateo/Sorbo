import type { Stock } from "@/types";
import { AlertIcon, CheckIcon, XCircleIcon } from "@/components/ui/icons";

/** Estado de stock: nunca solo color, siempre ícono + texto. */
export function StockBadge({ stock, showInStock = false }: { stock: Stock; showInStock?: boolean }) {
  if (stock === "in" && !showInStock) return null;
  const cfg = {
    in: { Icon: CheckIcon, text: "En stock", cls: "text-ok" },
    low: { Icon: AlertIcon, text: "Últimas unidades", cls: "text-warn" },
    out: { Icon: XCircleIcon, text: "Sin stock", cls: "text-muted-2" },
  }[stock];
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${cfg.cls}`}>
      <cfg.Icon width={16} height={16} />
      {cfg.text}
    </span>
  );
}
