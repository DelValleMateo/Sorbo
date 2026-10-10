"use client";

import { useState } from "react";
import { CheckIcon, ChatIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";
import { Price } from "@/components/ui/price";
import { StockBadge } from "@/components/ui/stock-badge";
import { useCart } from "@/lib/cart-store";
import type { Sellable } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { whatsappUrl } from "@/lib/order";
import { useUi } from "@/lib/ui-store";
import { btn } from "@/lib/ui";

const MAX = 24;

/**
 * Bloque de compra de la ficha: precio, cantidad y "Agregar al pedido".
 * En mobile se duplica la acción en una barra fija inferior (zona del pulgar).
 */
export function ProductPurchase({ item }: { item: Sellable }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const inCart = useCart((s) => s.items[item.id] ?? 0);
  const announce = useUi((s) => s.announce);
  const setCartOpen = useUi((s) => s.setCartOpen);
  const out = item.stock === "out";

  const onAdd = () => {
    add(item.id, qty);
    setAdded(true);
    announce(`${qty} ${qty === 1 ? "unidad" : "unidades"} de ${item.name} agregadas al pedido.`);
  };

  const consult = whatsappUrl(`¡Hola Sorbo! Quería consultar por ${item.name} ${item.detail}.`);

  return (
    <>
      <div className="flex flex-col gap-5 rounded-2xl bg-cream p-5 shadow-soft ring-1 ring-gold/20 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <Price price={item.price} oldPrice={item.oldPrice} className="text-4xl" stacked />
          <StockBadge stock={item.stock} showInStock />
        </div>

        {out ? (
          <a href={consult} target="_blank" rel="noopener noreferrer" className={btn("primary", "lg", "w-full")}>
            <ChatIcon width={20} height={20} />
            Consultar disponibilidad
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row">
            <div
              role="group"
              aria-label="Cantidad"
              className="inline-flex h-14 shrink-0 items-center justify-between rounded-lg border border-field bg-white"
            >
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Restar una unidad"
                className="inline-flex h-14 w-12 items-center justify-center rounded-lg text-wine hover:bg-wine-tint disabled:opacity-40"
              >
                <MinusIcon width={18} height={18} />
              </button>
              <output aria-live="polite" className="min-w-10 text-center text-lg font-extrabold tabular-nums">
                {qty}
              </output>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(MAX, q + 1))}
                disabled={qty >= MAX}
                aria-label="Sumar una unidad"
                className="inline-flex h-14 w-12 items-center justify-center rounded-lg text-wine hover:bg-wine-tint disabled:opacity-40"
              >
                <PlusIcon width={18} height={18} />
              </button>
            </div>
            <button type="button" onClick={onAdd} className={btn("primary", "lg", "flex-1")}>
              Agregar al pedido · {formatPrice(item.price * qty)}
            </button>
          </div>
        )}

        {added && inCart > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ok/40 bg-white px-3 py-2.5">
            <p className="flex items-center gap-2 text-[15px] font-bold text-ok">
              <CheckIcon width={18} height={18} />
              Tenés {inCart} en tu pedido
            </p>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="inline-flex min-h-11 items-center px-1 text-[15px] font-bold text-wine underline underline-offset-4"
            >
              Ver pedido
            </button>
          </div>
        )}

        {!out && (
          <a
            href={consult}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 text-[15px] font-bold text-wine underline-offset-4 hover:underline"
          >
            <ChatIcon width={18} height={18} />
            ¿Dudas? Consultanos por WhatsApp
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        )}
      </div>

      {/* Barra fija inferior en mobile y tablet */}
      {!out && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold/40 bg-cream/95 pb-[env(safe-area-inset-bottom)] shadow-bar backdrop-blur lg:hidden">
          <div className="wrap flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink">{item.name}</p>
              <p className="text-lg font-extrabold leading-tight text-ink">{formatPrice(item.price * qty)}</p>
            </div>
            <button type="button" onClick={onAdd} className={btn("primary", "md", "shrink-0")}>
              <PlusIcon width={18} height={18} />
              Agregar{qty > 1 ? ` ${qty}` : ""}
            </button>
            {inCart > 0 && (
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label={`Ver pedido, ${inCart} de este producto`}
                className={btn("outline", "md", "shrink-0 px-3")}
              >
                Pedido
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
