export type CategoryId =
  | "tintos" | "blancos" | "espumantes" | "cervezas" | "whisky"
  | "fernet" | "destilados" | "mixers";

export type Stock = "in" | "low" | "out";

export interface Category {
  id: CategoryId | "todo" | "combos";
  label: string;
  /** Texto corto para "Ver {short}" en el home */
  short?: string;
}

export interface Product {
  id: string;
  slug: string;
  cat: CategoryId;
  name: string;
  /** Presentación: "750 ml", "2 kg"… */
  detail: string;
  price: number;
  oldPrice?: number;
  bodega?: string;
  description: string;
  stock: Stock;
  /** Ruta de la foto (public/) y su texto alternativo */
  image: string;
  imageAlt: string;
}

export interface Combo {
  id: string;
  slug: string;
  name: string;
  detail: string;
  price: number;
  oldPrice: number;
  image: string;
  imageAlt: string;
  /** Componentes del combo, a modo informativo */
  includes: string[];
}

export interface Bodega {
  id: string;
  name: string;
  region: string;
  blurb: string;
}

export interface Review {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  productSlug?: string;
}

/** Carrito persistido: id de producto o combo -> cantidad */
export type CartMap = Record<string, number>;
