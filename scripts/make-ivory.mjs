// Genera el fondo marfil a partir de la textura de la felpa bordó:
// toma su relieve (luces y sombras) y lo recolorea en marfil, así ambas
// superficies comparten el mismo carácter de terciopelo.
// Uso: node scripts/make-ivory.mjs
import path from "node:path";
import sharp from "sharp";

const SRC = path.join(process.cwd(), "public", "images", "fondo-felpa.webp");
const OUT = path.join(process.cwd(), "public", "images", "fondo-papel.webp");

// Rango tonal del marfil: sombras (pliegues) -> luces
const DARK = [226, 214, 188];
const LIGHT = [248, 242, 228];
const GAMMA = 0.85;

const { data, info } = await sharp(SRC)
  .resize({ width: 1100 })
  .grayscale()
  .normalise({ lower: 2, upper: 98 })
  .raw()
  .toBuffer({ resolveWithObject: true });

const out = Buffer.alloc(info.width * info.height * 3);
for (let i = 0; i < data.length; i++) {
  const t = Math.pow(data[i] / 255, GAMMA);
  out[i * 3] = DARK[0] + (LIGHT[0] - DARK[0]) * t;
  out[i * 3 + 1] = DARK[1] + (LIGHT[1] - DARK[1]) * t;
  out[i * 3 + 2] = DARK[2] + (LIGHT[2] - DARK[2]) * t;
}

await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
  .webp({ quality: 82 })
  .toFile(OUT);
console.log("ok", OUT, `${info.width}x${info.height}`);
