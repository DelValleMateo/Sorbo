"use client";

import { useUi } from "@/lib/ui-store";

/** Región aria-live global: "Producto agregado", filtros aplicados, errores. */
export function LiveRegion() {
  const message = useUi((s) => s.message);
  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
