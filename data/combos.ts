import type { Combo } from "@/types";
import { slugify } from "@/lib/format";
import { comboImage } from "@/data/images";

// Fuente: array COMBOS del diseño v3.
const ROWS: [string, string, string, number, number][] = [
  ["c-cata", "Caja Degustación", "Malbec Reserva + Cabernet Sauvignon + Blend de autor", 29900, 33200],
  ["c-asado", "Combo Asado", "2 Malbec Reserva + 1 Bonarda joven", 22500, 25800],
  ["c-brindis", "Combo Brindis", "2 Extra Brut + Hielo 2 kg", 22900, 26300],
  ["c-previa", "Combo Previa", "Fernet 750 ml + 2 Cola 2,25 L + Hielo 2 kg", 22900, 26200],
  ["c-gin", "Combo Gin Tonic", "Gin London Dry 750 ml + 2 Tónica 1,5 L + Hielo 2 kg", 24900, 28400],
  ["c-birra", "Combo Birra", "12 latas rubia 473 ml", 21900, 25200],
  ["c-whisky", "Combo Whisky", "Blended escocés 750 ml + 2 Cola 2,25 L + Hielo 2 kg", 36900, 41200],
  ["c-aperitivo", "Combo Aperitivo", "Aperitivo rojo 750 ml + 2 Soda 1,5 L + Hielo 2 kg", 12900, 14800],
];

export const COMBOS: Combo[] = ROWS.map(([id, name, detail, price, oldPrice]) => ({
  id,
  slug: slugify(name),
  name,
  detail,
  price,
  oldPrice,
  image: comboImage(id),
  imageAlt: `Botellas del ${name}`,
  includes: detail.split(" + "),
}));

/** Combos que rotan en el hero (igual que el diseño). */
export const HERO_COMBO_IDS = ["c-cata", "c-asado", "c-brindis"] as const;
