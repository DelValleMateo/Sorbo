"use client";

import Form from "next/form";
import { SearchIcon } from "@/components/ui/icons";

interface Props {
  id: string;
  className?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
  defaultValue?: string;
}

/**
 * Buscador del catálogo. Es un formulario GET a /productos?q=…: funciona sin JS
 * y con JS navega del lado del cliente (next/form).
 */
export function SearchForm({ id, className = "", autoFocus, onSubmitted, defaultValue }: Props) {
  return (
    <Form action="/productos" role="search" className={`relative ${className}`} onSubmit={onSubmitted}>
      <label htmlFor={id} className="sr-only">
        Buscar en la tienda
      </label>
      <SearchIcon
        width={18}
        height={18}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        id={id}
        name="q"
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        placeholder="Buscar vinos, whisky, combos…"
        className="h-11 w-full rounded-lg border border-field bg-white/80 pl-10 pr-3 text-base text-ink transition-colors focus:border-wine focus:bg-white"
      />
    </Form>
  );
}
