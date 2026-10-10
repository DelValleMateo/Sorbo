import { findSellable } from "@/lib/catalog";
import { SITE } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import type { CartMap } from "@/types";

export type Entrega = "envio" | "retiro";
export type Pago = "" | "Efectivo" | "Transferencia" | "Tarjeta / QR";

export const PAGOS: Exclude<Pago, "">[] = ["Efectivo", "Transferencia", "Tarjeta / QR"];

/** Tarjeta y QR se cobran con el posnet del local: solo disponibles retirando. */
export const pagoDisponible = (pago: Pago, entrega: Entrega) =>
  pago !== "Tarjeta / QR" || entrega === "retiro";

export interface OrderForm {
  nombre: string;
  direccion: string;
  entrega: Entrega;
  pago: Pago;
}

export const EMPTY_FORM: OrderForm = { nombre: "", direccion: "", entrega: "envio", pago: "" };

export type OrderField = "nombre" | "direccion" | "pago";
export type OrderErrors = Partial<Record<OrderField, string>>;

export function cartLines(items: CartMap) {
  return Object.entries(items).flatMap(([id, qty]) => {
    const item = findSellable(id);
    return item ? [{ item, qty }] : [];
  });
}

export const cartSubtotal = (items: CartMap) =>
  cartLines(items).reduce((a, l) => a + l.item.price * l.qty, 0);

/** Envío con costo fijo; retiro sin cargo. */
export function computeTotals(items: CartMap, form: OrderForm) {
  const lines = cartLines(items);
  const subtotal = lines.reduce((a, l) => a + l.item.price * l.qty, 0);
  const shipping = form.entrega === "envio" ? SITE.shippingCost : 0;
  return { lines, subtotal, shipping, total: subtotal + shipping };
}

export function validateOrder(form: OrderForm): OrderErrors {
  const errors: OrderErrors = {};
  if (!form.nombre.trim()) errors.nombre = "Ingresá tu nombre y apellido.";
  if (form.entrega === "envio" && !form.direccion.trim())
    errors.direccion = "Ingresá la dirección de entrega.";
  if (!form.pago) errors.pago = "Elegí un método de pago.";
  else if (!pagoDisponible(form.pago, form.entrega))
    errors.pago = "Tarjeta o QR solo está disponible retirando en el local.";
  return errors;
}

export function whatsappOrderUrl(items: CartMap, form: OrderForm) {
  const t = computeTotals(items, form);
  const msg = [
    "¡Hola Sorbo! Quiero hacer este pedido:",
    "",
    ...t.lines.map(
      (l) =>
        `• ${l.qty} × ${l.item.name} (${l.item.kind === "combo" ? "combo" : l.item.detail}) — ${formatPrice(l.item.price * l.qty)}`,
    ),
    "",
    `Subtotal: ${formatPrice(t.subtotal)}`,
    form.entrega === "envio" ? `Envío: ${formatPrice(t.shipping)}` : "Retiro en el local",
    `*Total: ${formatPrice(t.total)}*`,
    "",
    `Nombre: ${form.nombre.trim()}`,
    form.entrega === "envio"
      ? `Entrega: envío a ${form.direccion.trim()}`
      : "Entrega: retiro en el local",
    `Pago: ${form.pago}`,
  ].join("\n");
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
}

export const whatsappUrl = (text: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
