"use client";

import { usePathname } from "next/navigation";
import { CartIcon } from "@/components/ui/icons";
import { selectCount, useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { cartSubtotal } from "@/lib/order";
import { useUi } from "@/lib/ui-store";

/** Barra flotante "Ver pedido": zona de alcance del pulgar. En la ficha la reemplaza su barra de compra. */
export function CartBar() {
  const pathname = usePathname();
  const count = useCart(selectCount);
  const subtotal = useCart((s) => cartSubtotal(s.items));
  const open = useUi((s) => s.cartOpen);
  const setOpen = useUi((s) => s.setCartOpen);

  if (count === 0 || open || pathname.startsWith("/productos/")) return null;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      className="focus-dark fixed bottom-4 left-1/2 z-30 flex h-14 max-w-[calc(100vw-32px)] -translate-x-1/2 animate-up items-center gap-3 whitespace-nowrap rounded-xl bg-wine-deep pl-4 pr-2 text-[15px] font-bold text-cream shadow-bar ring-1 ring-gold/40 md:bottom-6"
    >
      <CartIcon width={20} height={20} className="text-gold" />
      <span>
        Ver pedido · {count} {count === 1 ? "producto" : "productos"}
      </span>
      <span className="flex h-10 items-center rounded-lg bg-gold px-3 font-extrabold text-ink">
        {formatPrice(subtotal)}
      </span>
    </button>
  );
}
