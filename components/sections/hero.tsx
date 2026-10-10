"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { PauseIcon, PlayIcon } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const WORDS = ["asado.", "cena.", "brindis.", "domingo.", "festejo."];
const WORD_MS = 2800;

/** Cinta de botellas: debe coincidir con la duración de `.hero-belt-*` en globals.css. */
const BELT_S = 10;

/** Partículas marfil: posiciones fijas para que servidor y cliente coincidan. */
const MOTES = [
  { cx: 140, cy: 520, r: 2.5, delay: 0 },
  { cx: 330, cy: 540, r: 2, delay: 1.6 },
  { cx: 610, cy: 300, r: 3, delay: 3.1 },
  { cx: 80, cy: 380, r: 2, delay: 4.4 },
  { cx: 690, cy: 260, r: 2.5, delay: 2.2 },
  { cx: 420, cy: 240, r: 1.8, delay: 5.2 },
];

/* Siluetas con la base en (0, 0): bordelesa y espumante. */
const BORDEAUX =
  "M-11 -300 H11 V-212 C11 -188 40 -182 40 -150 V-8 Q40 0 32 0 H-32 Q-40 0 -40 -8 V-150 C-40 -182 -11 -188 -11 -212 Z";
const SPARKLING =
  "M-12 -300 H12 V-238 C12 -196 43 -178 43 -128 V-8 Q43 0 35 0 H-35 Q-43 0 -43 -8 V-128 C-43 -178 -12 -196 -12 -238 Z";

type BottleKind = {
  key: string;
  shape: string;
  glass: string;
  foil: string;
  foilH: number;
  label: string;
  labelInk: string;
  accent: string;
  variety: string;
};

const BOTTLES: BottleKind[] = [
  { key: "malbec", shape: BORDEAUX, glass: "url(#hero-g-tinto)", foil: "#9A2A40", foilH: 64, label: "#EFE4CD", labelInk: "#6D1A2E", accent: "#2A1A1C", variety: "MALBEC" },
  { key: "torrontes", shape: BORDEAUX, glass: "url(#hero-g-blanco)", foil: "#CDBFA4", foilH: 56, label: "#FBF6EC", labelInk: "#6D1A2E", accent: "#4A3833", variety: "TORRONTÉS" },
  { key: "brut", shape: SPARKLING, glass: "url(#hero-g-verde)", foil: "#F1E6D0", foilH: 92, label: "#1B1416", labelInk: "#F1E6D0", accent: "#F1E6D0", variety: "BRUT NATURE" },
  { key: "rose", shape: BORDEAUX, glass: "url(#hero-g-rosado)", foil: "#B23A52", foilH: 56, label: "#FBF6EC", labelInk: "#9A2A40", accent: "#4A3833", variety: "ROSÉ" },
  { key: "cabernet", shape: BORDEAUX, glass: "url(#hero-g-tinto)", foil: "#2A070D", foilH: 64, label: "#6D1A2E", labelInk: "#F1E6D0", accent: "#EFE4CD", variety: "CABERNET" },
];

function Bottle({ b }: { b: BottleKind }) {
  const w = b.shape === SPARKLING ? 34 : 33;
  return (
    <>
      <path d={b.shape} fill={b.glass} />
      <rect x="-12.5" y="-303" width="25" height={b.foilH} rx="3" fill={b.foil} />
      <rect x="-13.5" y="-304" width="27" height="8" rx="3" fill={b.foil} style={{ filter: "brightness(1.15)" }} />
      <rect x={-w} y="-128" width={w * 2} height="84" rx="3" fill={b.label} />
      <rect x={-w + 5} y="-123" width={w * 2 - 10} height="74" rx="1.5" fill="none" stroke="#8A6F5A" strokeWidth="1" />
      <text
        x="0"
        y="-92"
        textAnchor="middle"
        fontStyle="italic"
        fontWeight="600"
        fontSize="18"
        fill={b.labelInk}
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Sorbo
      </text>
      <rect x="-13" y="-84" width="26" height="1" fill="#8A6F5A" />
      <text
        x="0"
        y="-68"
        textAnchor="middle"
        fontWeight="700"
        fontSize="6.5"
        letterSpacing="1.6"
        fill={b.accent}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {b.variety}
      </text>
      <path d="M-30 -146 V-14" stroke="rgba(255,255,255,.16)" strokeWidth="5" strokeLinecap="round" />
      <path d="M-5 -232 V-214" stroke="rgba(255,255,255,.18)" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

/**
 * Hero: la frase "Un vino para cada…" y una cinta de botellas Sorbo que entran en la bolsa.
 * La animación es decorativa, se puede pausar (WCAG 2.2.2) y se detiene con movimiento reducido.
 */
export function Hero() {
  const reduced = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const [word, setWord] = useState(0);
  const running = !paused && !reduced;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setWord((w) => (w + 1) % WORDS.length), WORD_MS);
    return () => clearInterval(t);
  }, [running]);

  /* Desfase negativo: al cargar (o en pausa) la cinta ya está llena y escalonada. */
  const delay = (i: number) =>
    ({ "--belt-delay": `${-((i * BELT_S) / BOTTLES.length + 1)}s` }) as CSSProperties;

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className={`focus-dark relative overflow-hidden bg-felpa text-cream ${running ? "" : "hero-paused"}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_68%_45%,rgba(201,72,94,.35),transparent_60%),linear-gradient(180deg,rgba(20,3,7,.15),rgba(20,3,7,.55))]"
      />

      <div className="wrap relative grid min-h-[min(86svh,800px)] items-center gap-6 pb-6 pt-10 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
        <h1 id="hero-title" className="flex flex-col gap-2 font-serif font-medium leading-none tracking-[-0.02em]">
          <span className="sr-only">Un vino para cada ocasión: asado, cena, brindis, domingo y festejo.</span>
          <span aria-hidden="true" className="animate-up text-[clamp(40px,5.2vw,76px)]">
            Un vino para cada
          </span>
          <span
            aria-hidden="true"
            className="relative inline-grid animate-up text-[clamp(68px,10vw,152px)] italic text-gold [animation-delay:.12s]"
          >
            {WORDS.map((w, i) => {
              const on = i === word;
              const prev = i === (word - 1 + WORDS.length) % WORDS.length;
              return (
                <span
                  key={w}
                  className={`col-start-1 row-start-1 whitespace-nowrap pb-[0.1em] transition-[opacity,transform,filter] duration-700 ${
                    on
                      ? "opacity-100"
                      : `opacity-0 blur-[6px] ${prev ? "-translate-y-[0.35em]" : "translate-y-[0.35em]"}`
                  }`}
                >
                  {w}
                </span>
              );
            })}
          </span>
        </h1>

        <div className="flex animate-up justify-center [animation-delay:.2s]">
          <svg
            viewBox="0 0 760 620"
            role="img"
            aria-label="Botellas de vino Sorbo entrando, una tras otra, en una bolsa de Sorbo"
            className="h-auto w-full max-w-[680px]"
          >
            <defs>
              <linearGradient id="hero-g-tinto" x1="0" x2="1">
                <stop offset="0" stopColor="#0B0204" />
                <stop offset=".18" stopColor="#3D0C17" />
                <stop offset=".34" stopColor="#170508" />
                <stop offset=".82" stopColor="#0A0203" />
                <stop offset="1" stopColor="#2E0912" />
              </linearGradient>
              <linearGradient id="hero-g-blanco" x1="0" x2="1">
                <stop offset="0" stopColor="#A8903E" />
                <stop offset=".22" stopColor="#F1E4A6" />
                <stop offset=".42" stopColor="#D9C46E" />
                <stop offset="1" stopColor="#9C8436" />
              </linearGradient>
              <linearGradient id="hero-g-rosado" x1="0" x2="1">
                <stop offset="0" stopColor="#B2505F" />
                <stop offset=".22" stopColor="#F4B9BC" />
                <stop offset=".42" stopColor="#E08590" />
                <stop offset="1" stopColor="#A4434F" />
              </linearGradient>
              <linearGradient id="hero-g-verde" x1="0" x2="1">
                <stop offset="0" stopColor="#06120B" />
                <stop offset=".18" stopColor="#24503A" />
                <stop offset=".34" stopColor="#0F2A1C" />
                <stop offset="1" stopColor="#081A10" />
              </linearGradient>
              <linearGradient id="hero-g-bag" x1="0" x2="1">
                <stop offset="0" stopColor="#E9DCC2" />
                <stop offset=".45" stopColor="#F6EEDD" />
                <stop offset="1" stopColor="#DCCBAA" />
              </linearGradient>
              <linearGradient id="hero-g-fade" x1="0" x2="140" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#000" />
                <stop offset="1" stopColor="#fff" />
              </linearGradient>
              <linearGradient id="hero-g-shelf" x1="0" x2="1">
                <stop offset="0" stopColor="#F1E6D0" stopOpacity="0" />
                <stop offset=".25" stopColor="#F1E6D0" stopOpacity=".45" />
                <stop offset="1" stopColor="#F1E6D0" stopOpacity=".3" />
              </linearGradient>
              <mask id="hero-belt-fade" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1160" height="1020">
                <rect x="-200" y="-200" width="1160" height="1020" fill="url(#hero-g-fade)" />
              </mask>
              {/* Nada de las botellas se ve por debajo del estante (así "caen" dentro de la bolsa). */}
              <clipPath id="hero-belt-clip">
                <rect x="-200" y="-200" width="1160" height="760.5" />
              </clipPath>
            </defs>

            {/* Estante y sombras */}
            <path d="M0 560.5 H760" stroke="url(#hero-g-shelf)" strokeWidth="1.5" />
            <ellipse cx="625" cy="563" rx="135" ry="9" fill="#000" opacity=".4" />
            <g mask="url(#hero-belt-fade)">
              {BOTTLES.map((b, i) => (
                <g key={b.key} className="hero-belt-x" style={delay(i)}>
                  <ellipse className="hero-belt-shadow" cx="0" cy="562" rx="46" ry="6" fill="#000" opacity=".38" />
                </g>
              ))}
            </g>

            {/* Bolsa: fondo, manija y botellas que ya están adentro */}
            <g className="hero-bag">
              <path d="M572 368 C566 272 654 272 648 368" fill="none" stroke="#8A6F5A" strokeWidth="5" strokeLinecap="round" />
              <path d="M720 380 L744 366 V550 L720 560 Z" fill="#CDBE9F" />
              <path d="M500 380 L516 362 H704 L720 380 Z" fill="#A99572" />
              <g clipPath="url(#hero-belt-clip)">
                <g transform="translate(576 636) rotate(-7)">
                  <Bottle b={BOTTLES[4]} />
                </g>
                <g transform="translate(648 646) rotate(6)">
                  <Bottle b={BOTTLES[2]} />
                </g>
              </g>
            </g>

            {/* Cinta: X e Y van en grupos separados para que el arco salga continuo */}
            <g clipPath="url(#hero-belt-clip)">
              <g mask="url(#hero-belt-fade)">
                {BOTTLES.map((b, i) => (
                  <g key={b.key} className="hero-belt-x" style={delay(i)}>
                    <g className="hero-belt-y">
                      <g transform="translate(0 560)">
                        <Bottle b={b} />
                      </g>
                    </g>
                  </g>
                ))}
              </g>
            </g>

            {/* Bolsa: frente (tapa las botellas al caer) */}
            <g className="hero-bag">
              <rect x="500" y="380" width="220" height="180" rx="3" fill="url(#hero-g-bag)" />
              <rect x="500" y="380" width="220" height="14" fill="#D7C6A4" />
              <rect x="512" y="406" width="196" height="142" rx="2" fill="none" stroke="#8A6F5A" strokeWidth="1.2" />
              <text
                x="610"
                y="486"
                textAnchor="middle"
                fontStyle="italic"
                fontWeight="600"
                fontSize="54"
                fill="#6D1A2E"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Sorbo
              </text>
              <rect x="584" y="502" width="52" height="1.5" fill="#8A6F5A" />
              <text
                x="610"
                y="526"
                textAnchor="middle"
                fontWeight="700"
                fontSize="11"
                letterSpacing="5"
                fill="#4A3833"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                VINOTECA
              </text>
            </g>

            <g fill="#F1E6D0">
              {MOTES.map((m) => (
                <circle
                  key={`${m.cx}-${m.cy}`}
                  className="hero-mote"
                  cx={m.cx}
                  cy={m.cy}
                  r={m.r}
                  style={{ animationDelay: `${m.delay}s` }}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>

      <div className="wrap relative flex items-center justify-between pb-6">
        <span aria-hidden="true" className="w-11" />
        <a
          href="#vinos"
          aria-label="Bajar a la vinoteca"
          className="hero-bob inline-flex h-12 w-12 items-center justify-center rounded-full border border-cream/50 text-cream no-underline hover:bg-cream hover:text-wine"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
        {reduced ? (
          <span aria-hidden="true" className="w-11" />
        ) : (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Reanudar animación" : "Pausar animación"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/40 text-cream hover:bg-cream hover:text-wine"
          >
            {paused ? <PlayIcon width={16} height={16} /> : <PauseIcon width={16} height={16} />}
          </button>
        )}
      </div>
    </section>
  );
}
