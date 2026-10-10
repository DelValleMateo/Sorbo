// Descarga fotos de botellas desde Wikimedia Commons, las recorta a 4:5 y
// genera data/image-credits.json con autor y licencia. Uso: node scripts/fetch-images.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const UA = { "User-Agent": "SorboDemo/1.0 (mateodelvalle100@gmail.com)" };
const OUT = path.join(process.cwd(), "public", "images", "bottles");
fs.mkdirSync(OUT, { recursive: true });

const IMAGES = {
  hielo: "Ice cube bag 01.jpg",
  cola: "15-09-26-RalfR-WLC-0098 - Coca-Cola glass bottle (Germany).jpg",
};

const strip = (h = "") => h.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const credits = {};

for (const [key, title] of Object.entries(IMAGES)) {
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.search = new URLSearchParams({
    action: "query", titles: "File:" + title, prop: "imageinfo", iiprop: "extmetadata|url",
    iiextmetadatafilter: "Artist|LicenseShortName|LicenseUrl", format: "json",
  });
  const meta = await (await fetch(api, { headers: UA })).json();
  const info = Object.values(meta.query.pages)[0].imageinfo[0];
  const m = info.extmetadata;
  credits[key] = {
    file: title,
    author: strip(m.Artist?.value) || "Dominio público",
    license: m.LicenseShortName?.value ?? "",
    licenseUrl: m.LicenseUrl?.value ?? "",
    source: info.descriptionurl,
  };
  const url = "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(title) + "?width=1200";
  const res = await fetch(url, { headers: UA });
  if (!res.ok) { console.log("FAIL", key, res.status); continue; }
  await sharp(Buffer.from(await res.arrayBuffer()))
    .resize(800, 1000, { fit: "cover", position: sharp.strategy.attention })
    .webp({ quality: 78 })
    .toFile(path.join(OUT, key + ".webp"));
  console.log("ok", key, credits[key].license);
  await new Promise((r) => setTimeout(r, 500));
}

// El campo Artist de Commons viene mal para esta foto; ver página de origen.
if (credits.espumante.author.startsWith("Taken on")) credits.espumante.author = "Autoría en Wikimedia Commons (ver fuente)";
fs.writeFileSync(path.join(process.cwd(), "data", "image-credits.json"), JSON.stringify(credits, null, 2));
