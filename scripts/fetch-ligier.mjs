// Descarga las fotos de producto de ligier.com.ar (uso autorizado por el titular del proyecto)
// y genera:
//   public/images/products/<SKU>.webp   fotos 4:5 recortadas
//   public/images/combos/<id>.webp      composición 16:10 con las botellas del combo
//   public/images/tiles/<id>.webp       composición 4:3 para los tiles de vinos
// Uso: node scripts/fetch-ligier.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const BASE = "https://lgr.vinotecaligier.com/productos/";
const ROOT = path.join(process.cwd(), "public", "images");
const RAW = path.join(process.cwd(), ".cache", "ligier");
const dirs = [...["products", "combos", "tiles"].map((d) => path.join(ROOT, d)), RAW];
dirs.forEach((d) => fs.mkdirSync(d, { recursive: true }));

/** slug de producto de Sorbo -> SKU de Ligier */
const MAP = {
  "malbec-reserva-750-ml": "BE79748",
  "cabernet-sauvignon-750-ml": "BE73596",
  "blend-de-autor-750-ml": "BE72895",
  "bonarda-joven-750-ml": "BE74059",
  "torrontes-750-ml": "BE76622",
  "sauvignon-blanc-750-ml": "BE74062",
  "rosado-de-malbec-750-ml": "BE74064",
  "chardonnay-750-ml": "BE73597",
  "extra-brut-750-ml": "BE03365",
  "brut-nature-750-ml": "BE73985",
  "dulce-natural-750-ml": "BE71323",
  "rubia-lata-473-ml": "BE71193",
  "ipa-lata-473-ml": "BE76498",
  "negra-1-l": "BE80021",
  "pack-rubia-x6-6-473-ml": "BE79995",
  "blended-escoces-750-ml": "BE78465",
  "bourbon-750-ml": "BE03889",
  "whisky-nacional-750-ml": "BE73794",
  "fernet-750-ml": "BE70887",
  "fernet-1-l": "BE71571",
  "aperitivo-rojo-750-ml": "BE72778",
  "vermouth-rosso-1-l": "BE55504",
  "gin-london-dry-750-ml": "BE71635",
  "gin-nacional-700-ml": "BE76161",
  "vodka-1-l": "BE76011",
  "ron-anejo-750-ml": "BE70370",
  "tonica-1-5-l": "BE76433",
  "lima-limon-2-25-l": "BE76444",
};

const COMBOS = {
  "c-cata": ["BE79748", "BE73596", "BE72895"],
  "c-asado": ["BE79748", "BE79748", "BE74059"],
  "c-brindis": ["BE03365", "BE03365"],
  "c-previa": ["BE70887", "BE76444", "BE76433"],
  "c-gin": ["BE71635", "BE76433", "BE76433"],
  "c-birra": ["BE79995", "BE79995", "BE79995"],
  "c-whisky": ["BE78465", "BE76444", "BE76433"],
  "c-aperitivo": ["BE72778", "BE76444"],
};

const TILES = {
  tintos: ["BE79748", "BE73596", "BE72895"],
  blancos: ["BE76622", "BE74062", "BE73597"],
  espumantes: ["BE03365", "BE73985", "BE71323"],
};

const skus = [...new Set(Object.values(MAP))];
const trimmed = {};

for (const sku of skus) {
  const file = path.join(RAW, `${sku}.jpg`);
  if (!fs.existsSync(file)) {
    const res = await fetch(`${BASE}${sku}.jpg`, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) { console.log("FAIL", sku, res.status); continue; }
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    await new Promise((r) => setTimeout(r, 250));
  }
  // Recorta el blanco sobrante para que la botella ocupe el cuadro.
  const t = await sharp(file).trim({ background: "#ffffff", threshold: 14 }).png().toBuffer();
  trimmed[sku] = t;
  await sharp(t)
    .resize(680, 900, { fit: "inside" })
    .extend({ top: 50, bottom: 50, left: 60, right: 60, background: "#ffffff" })
    .resize(800, 1000, { fit: "contain", background: "#ffffff" })
    .flatten({ background: "#ffffff" })
    .webp({ quality: 82 })
    .toFile(path.join(ROOT, "products", `${sku}.webp`));
}

async function row(list, w, h, outFile, pad = 0.12) {
  const hh = Math.round(h * (1 - pad * 2));
  const parts = await Promise.all(
    list.map((s) => sharp(trimmed[s]).resize({ height: hh }).png().toBuffer()),
  );
  const metas = await Promise.all(parts.map((p) => sharp(p).metadata()));
  const gap = 36;
  const total = metas.reduce((a, m) => a + m.width, 0) + gap * (parts.length - 1);
  let x = Math.round((w - total) / 2);
  const comps = parts.map((input, i) => {
    const c = { input, left: x, top: Math.round((h - metas[i].height) / 2) };
    x += metas[i].width + gap;
    return c;
  });
  await sharp({ create: { width: w, height: h, channels: 3, background: "#ffffff" } })
    .composite(comps)
    .webp({ quality: 82 })
    .toFile(outFile);
}

for (const [id, list] of Object.entries(COMBOS)) await row(list, 1200, 750, path.join(ROOT, "combos", `${id}.webp`));
for (const [id, list] of Object.entries(TILES)) await row(list, 1200, 900, path.join(ROOT, "tiles", `${id}.webp`), 0.08);

fs.writeFileSync(
  path.join(process.cwd(), "data", "ligier-skus.json"),
  JSON.stringify(MAP, null, 2),
);
console.log("listo:", skus.length, "productos,", Object.keys(COMBOS).length, "combos,", Object.keys(TILES).length, "tiles");
