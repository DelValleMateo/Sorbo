import type { CategoryId, Product, Stock } from "@/types";
import { slugify } from "@/lib/format";
import { productImage } from "@/data/images";

// Fuente: array PRODUCTS del diseño v3 (cat, nombre, presentación, precio).
// Agregados por mí (el diseño no los define): bodega, descripción, stock y oldPrice.
type Row = [CategoryId, string, string, number, string?, Stock?, number?];

const ROWS: Row[] = [
  ["tintos", "Malbec Reserva", "750 ml", 9800, "Bodega Altamira"],
  ["tintos", "Cabernet Sauvignon", "750 ml", 8900, "Finca Los Cardones"],
  ["tintos", "Blend de autor", "750 ml", 14500, "Bodega Altamira", "low"],
  ["tintos", "Bonarda joven", "750 ml", 6200, "Finca Los Cardones", "in", 6900],
  ["blancos", "Torrontés", "750 ml", 7400, "Bodega Cafayate Alto"],
  ["blancos", "Sauvignon Blanc", "750 ml", 8200, "Bodega Altamira"],
  ["blancos", "Rosado de Malbec", "750 ml", 7900, "Finca Los Cardones"],
  ["blancos", "Chardonnay", "750 ml", 9600, "Bodega Cafayate Alto", "out"],
  ["espumantes", "Extra Brut", "750 ml", 11900, "Bodega Altamira"],
  ["espumantes", "Brut Nature", "750 ml", 15800, "Bodega Altamira", "low"],
  ["espumantes", "Dulce natural", "750 ml", 8700, "Finca Los Cardones"],
  ["cervezas", "Rubia lata", "473 ml", 2100],
  ["cervezas", "IPA lata", "473 ml", 3400],
  ["cervezas", "Negra", "1 L", 4600],
  ["cervezas", "Pack rubia x6", "6 × 473 ml", 11500, undefined, "in", 12600],
  ["whisky", "Blended escocés", "750 ml", 29900],
  ["whisky", "Bourbon", "750 ml", 38500],
  ["whisky", "Whisky nacional", "750 ml", 15900],
  ["fernet", "Fernet", "750 ml", 13900],
  ["fernet", "Fernet", "1 L", 17900],
  ["fernet", "Aperitivo rojo", "750 ml", 7900],
  ["fernet", "Vermouth rosso", "1 L", 8400],
  ["destilados", "Gin London Dry", "750 ml", 19500],
  ["destilados", "Gin nacional", "700 ml", 11200],
  ["destilados", "Vodka", "1 L", 9900],
  ["destilados", "Ron añejo", "750 ml", 16800],
  ["mixers", "Hielo", "2 kg", 2500],
  ["mixers", "Cola", "2,25 L", 3900],
  ["mixers", "Tónica", "1,5 L", 3200],
  ["mixers", "Lima-limón", "2,25 L", 3600],
];

const DESCRIPTIONS: Record<CategoryId, string> = {
  tintos: "Tinto de bodega argentina, para acompañar carnes, pastas y quesos.",
  blancos: "Fresco y aromático, ideal para pescados, ensaladas y el aperitivo.",
  espumantes: "Burbuja fina para brindar. Servir bien frío entre 6 y 8 °C.",
  cervezas: "Bien fría es mejor. Ideal para compartir.",
  whisky: "Para tomar solo, con hielo o en tragos largos.",
  fernet: "Clásico de la previa y de las reuniones.",
  destilados: "Base para tragos: gin tonic, screwdriver, daiquiri.",
  mixers: "Todo lo que necesitás para completar el trago.",
};

export const PRODUCTS: Product[] = ROWS.map(
  ([cat, name, detail, price, bodega, stock = "in", oldPrice], i) => {
    const slug = slugify(`${name} ${detail}`);
    return {
    id: `p${i}`,
    slug,
    cat,
    name,
    detail,
    price,
    oldPrice,
    bodega,
    description: DESCRIPTIONS[cat],
    stock,
    image: productImage(slug, name),
    imageAlt: `${name} ${detail}`,
  };
  },
);

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
