import { CATEGORIES } from "@/data/categories";
import { SELLABLES, type Sellable } from "@/lib/catalog";

export const SORTS = [
  { id: "relevancia", label: "Relevancia" },
  { id: "precio-asc", label: "Menor precio" },
  { id: "precio-desc", label: "Mayor precio" },
  { id: "nombre", label: "Nombre A-Z" },
] as const;

export type SortId = (typeof SORTS)[number]["id"];

export interface Filters {
  cats: string[];
  q: string;
  orden: SortId;
  /** Rango de precio; null = sin límite */
  min: number | null;
  max: number | null;
}

type Raw = Record<string, string | string[] | undefined>;

const VALID_CATS = new Set<string>(CATEGORIES.filter((c) => c.id !== "todo").map((c) => c.id));
const SORT_IDS = SORTS.map((s) => s.id) as string[];

/** Límites del slider de precio, redondeados a $1.000 a partir del catálogo. */
const prices = SELLABLES.map((s) => s.price);
export const PRICE_BOUNDS = {
  min: Math.floor(Math.min(...prices) / 1000) * 1000,
  max: Math.ceil(Math.max(...prices) / 1000) * 1000,
  step: 500,
} as const;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const toPrice = (v: string | string[] | undefined) => {
  const n = Number.parseInt(first(v) ?? "", 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function parseFilters(raw: Raw): Filters {
  const cats = (first(raw.cat) ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter((c) => VALID_CATS.has(c));
  const orden = first(raw.orden) ?? "";
  let min = toPrice(raw.min);
  let max = toPrice(raw.max);
  if (min !== null && max !== null && min > max) [min, max] = [max, min];
  return {
    cats: [...new Set(cats)],
    q: (first(raw.q) ?? "").trim().slice(0, 60),
    orden: (SORT_IDS.includes(orden) ? orden : "relevancia") as SortId,
    min,
    max,
  };
}

export function buildHref(base: string, f: Partial<Filters>) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.cats?.length) p.set("cat", f.cats.join(","));
  if (f.min != null) p.set("min", String(f.min));
  if (f.max != null) p.set("max", String(f.max));
  if (f.orden && f.orden !== "relevancia") p.set("orden", f.orden);
  const qs = p.toString();
  return qs ? `${base}?${qs}` : base;
}

/** Convierte la posición del slider en filtro: en los extremos no se limita. */
export const rangeToFilter = ([a, b]: number[]) => ({
  min: a <= PRICE_BOUNDS.min ? null : a,
  max: b >= PRICE_BOUNDS.max ? null : b,
});

export function searchItems(items: Sellable[], q: string) {
  if (!q) return items;
  const needle = normalize(q);
  return items.filter((i) => normalize(`${i.name} ${i.detail}`).includes(needle));
}

/** Búsqueda + precio, sin categorías: base para contar resultados por categoría. */
export function baseItems(items: Sellable[], f: Pick<Filters, "q" | "min" | "max">) {
  return searchItems(items, f.q).filter(
    (i) => (f.min == null || i.price >= f.min) && (f.max == null || i.price <= f.max),
  );
}

export function applyFilters(items: Sellable[], f: Filters) {
  let out = baseItems(items, f);
  if (f.cats.length) out = out.filter((i) => f.cats.includes(i.cat));
  const sorted = [...out];
  if (f.orden === "precio-asc") sorted.sort((a, b) => a.price - b.price);
  if (f.orden === "precio-desc") sorted.sort((a, b) => b.price - a.price);
  if (f.orden === "nombre") sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
  return sorted;
}

export const categoryName = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id;
