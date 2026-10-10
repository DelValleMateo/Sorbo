"use client";

import { Select } from "radix-ui";
import { CheckIcon, ChevronDownIcon } from "@/components/ui/icons";
import { CATEGORIES } from "@/data/categories";

interface Props {
  /** id de categoría, "todo", o "" cuando hay varias elegidas (muestra el placeholder) */
  value: string;
  onValueChange: (id: string) => void;
  counts: Record<string, number>;
  total: number;
  placeholder?: string;
  /** Clases extra del disparador (ancho, visibilidad por breakpoint) */
  className?: string;
}

/**
 * Desplegable de categoría (Radix Select): accesible con teclado y lector de pantalla,
 * muestra la cantidad de productos de cada opción.
 */
export function CategorySelect({
  value,
  onValueChange,
  counts,
  total,
  placeholder = "Varias categorías",
  className = "inline-flex",
}: Props) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        aria-label="Categoría"
        className={`h-12 min-w-0 items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 text-[15px] font-bold text-ink transition-colors hover:border-wine data-[state=open]:border-wine ${className}`}
      >
        <span className="truncate">
          <span className="font-normal text-muted">Categoría: </span>
          <Select.Value placeholder={placeholder} />
        </span>
        <Select.Icon>
          <ChevronDownIcon width={18} height={18} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          className="z-[60] max-h-[min(420px,var(--radix-select-content-available-height))] min-w-[max(var(--radix-select-trigger-width),16rem)] overflow-hidden rounded-xl border border-line bg-cream text-ink shadow-hero"
        >
          <Select.Viewport className="p-1">
            {CATEGORIES.map((c) => {
              const n = c.id === "todo" ? total : (counts[c.id] ?? 0);
              return (
                <Select.Item
                  key={c.id}
                  value={c.id}
                  className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 text-[15px] font-semibold outline-none data-[highlighted]:bg-sand data-[state=checked]:text-wine"
                >
                  <span className="flex w-4 shrink-0 justify-center">
                    <Select.ItemIndicator>
                      <CheckIcon width={16} height={16} />
                    </Select.ItemIndicator>
                  </span>
                  <Select.ItemText>{c.id === "todo" ? "Todas" : c.label}</Select.ItemText>
                  <span className="ml-auto pl-4 text-xs font-semibold text-muted tabular-nums">
                    {n}
                    <span className="sr-only"> productos</span>
                  </span>
                </Select.Item>
              );
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
