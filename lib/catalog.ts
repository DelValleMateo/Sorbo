import { COMBOS } from "@/data/combos";
import { PRODUCTS } from "@/data/products";
import type { CategoryId, Stock } from "@/types";

/** Vista unificada de productos y combos: lo que se puede agregar al carrito. */
export interface Sellable {
  id: string;
  slug: string;
  kind: "product" | "combo";
  cat: CategoryId | "combos";
  name: string;
  detail: string;
  price: number;
  oldPrice?: number;
  image: string;
  imageAlt: string;
  stock: Stock;
}

const COMBO_ITEMS = COMBOS.map<Sellable>((c) => ({
    id: c.id,
    slug: c.slug,
    kind: "combo",
    cat: "combos",
    name: c.name,
    detail: c.detail,
    price: c.price,
    oldPrice: c.oldPrice,
    image: c.image,
    imageAlt: c.imageAlt,
    stock: "in",
  }));

const PRODUCT_ITEMS = PRODUCTS.map<Sellable>((p) => ({
    id: p.id,
    slug: p.slug,
    kind: "product",
    cat: p.cat,
    name: p.name,
    detail: p.detail,
    price: p.price,
    oldPrice: p.oldPrice,
    image: p.image,
    imageAlt: p.imageAlt,
    stock: p.stock,
}));

export const COMBO_SELLABLES = COMBO_ITEMS;
export const PRODUCT_SELLABLES = PRODUCT_ITEMS;
/** Catálogo completo: productos primero, combos al final. */
export const SELLABLES: Sellable[] = [...PRODUCT_ITEMS, ...COMBO_ITEMS];

const BY_ID = new Map(SELLABLES.map((s) => [s.id, s]));

export const findSellable = (id: string) => BY_ID.get(id);

export const discountPct = (price: number, oldPrice?: number) =>
  oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0;
