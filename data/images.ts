import ligier from "./ligier-skus.json";
import credits from "./image-credits.json";

/** Fotos de producto: Vinoteca Ligier (ligier.com.ar), uso autorizado por el titular. */
export const IMAGE_SOURCE = { name: "Vinoteca Ligier", url: "https://ligier.com.ar" } as const;

/** Productos sin equivalente en el catálogo de Ligier (fotos de Wikimedia Commons). */
const FALLBACK: Record<string, keyof typeof credits> = {
  Hielo: "hielo",
  Cola: "cola",
};

const SKUS = ligier as Record<string, string>;

export const productImage = (slug: string, name: string) => {
  const sku = SKUS[slug];
  if (sku) return `/images/products/${sku}.webp`;
  const key = FALLBACK[name];
  return key ? `/images/bottles/${key}.webp` : "/images/bottles/hielo.webp";
};

export const comboImage = (id: string) => `/images/combos/${id}.webp`;

export const IMAGE_CREDITS = credits;
