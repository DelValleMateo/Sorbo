/**
 * Sistema de botones de Sorbo. Una sola fuente de verdad para variantes y tamaños,
 * así todos los CTA del sitio comparten forma, peso y estados.
 */
type Variant = "primary" | "light" | "outline" | "outline-light" | "gold";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-bold no-underline transition-[background-color,color,border-color,box-shadow,transform] duration-200 active:scale-[.98] disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none motion-reduce:active:scale-100";

const VARIANTS: Record<Variant, string> = {
  // Sobre superficies claras
  primary: "bg-wine text-cream shadow-btn hover:bg-wine-dark hover:text-cream",
  outline: "border border-ink/80 bg-transparent text-ink hover:border-wine hover:bg-wine hover:text-cream",
  // Sobre felpa / terciopelo
  light: "bg-cream text-wine shadow-cta hover:bg-white hover:text-wine-dark",
  "outline-light": "border border-cream/70 bg-transparent text-cream hover:bg-cream hover:text-wine",
  gold: "bg-gold text-ink hover:bg-cream hover:text-ink",
};

const SIZES: Record<Size, string> = {
  sm: "h-11 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
};

export const btn = (variant: Variant = "primary", size: Size = "md", extra = "") =>
  `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${extra}`.trim();
