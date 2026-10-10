"use client";

import { Slider } from "radix-ui";
import { formatPrice } from "@/lib/format";
import { PRICE_BOUNDS } from "@/lib/filters";

interface Props {
  value: [number, number];
  onValueChange: (v: [number, number]) => void;
  onValueCommit?: (v: [number, number]) => void;
  labelId: string;
}

const thumbCls =
  "relative block h-7 w-7 cursor-grab before:absolute before:-inset-2 before:rounded-full before:content-[''] rounded-full border-2 border-wine bg-cream shadow-btn transition-transform hover:scale-110 active:cursor-grabbing motion-reduce:transition-none";

/**
 * Rango de precio con dos manijas (Radix Slider): se maneja con mouse, dedo o teclado
 * (flechas, Re Pág/Av Pág, Inicio/Fin). Los valores se leen como precio, no como número suelto.
 */
export function PriceRange({ value, onValueChange, onValueCommit, labelId }: Props) {
  const [lo, hi] = value;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm font-bold text-ink">
        <span>
          <span className="font-normal text-muted">Desde </span>
          {formatPrice(lo)}
        </span>
        <span>
          <span className="font-normal text-muted">Hasta </span>
          {formatPrice(hi)}
          {hi >= PRICE_BOUNDS.max && "+"}
        </span>
      </div>
      <Slider.Root
        aria-labelledby={labelId}
        min={PRICE_BOUNDS.min}
        max={PRICE_BOUNDS.max}
        step={PRICE_BOUNDS.step}
        minStepsBetweenThumbs={2}
        value={value}
        onValueChange={(v) => onValueChange([v[0], v[1]])}
        onValueCommit={(v) => onValueCommit?.([v[0], v[1]])}
        className="relative mx-3 flex h-11 touch-none select-none items-center"
      >
        <Slider.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-line-strong">
          <Slider.Range className="absolute h-full rounded-full bg-wine" />
        </Slider.Track>
        <Slider.Thumb aria-label="Precio mínimo" aria-valuetext={formatPrice(lo)} className={thumbCls} />
        <Slider.Thumb aria-label="Precio máximo" aria-valuetext={formatPrice(hi)} className={thumbCls} />
      </Slider.Root>
    </div>
  );
}
