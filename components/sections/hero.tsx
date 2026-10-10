"use client";

import { useEffect, useState } from "react";
import { PauseIcon, PlayIcon } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const WORDS = ["asado.", "cena.", "brindis.", "domingo.", "festejo."];
const WORD_MS = 2800;

/** Partículas doradas: posiciones fijas para que servidor y cliente coincidan. */
const MOTES = [
  { cx: 120, cy: 560, r: 2.5, delay: 0 },
  { cx: 360, cy: 600, r: 2, delay: 1.6 },
  { cx: 560, cy: 580, r: 3, delay: 3.1 },
  { cx: 80, cy: 420, r: 2, delay: 4.4 },
  { cx: 600, cy: 420, r: 2.5, delay: 2.2 },
  { cx: 400, cy: 300, r: 1.8, delay: 5.2 },
];

const BOTTLE =
  "M232 70 H268 V245 C268 282 328 298 328 350 V600 Q328 618 310 618 H190 Q172 618 172 600 V350 C172 298 232 282 232 245 Z";
const BOWL = "M418 372 C416 444 438 512 480 518 C522 512 544 444 542 372 Z";

/**
 * Hero visual: solo la frase "Un vino para cada…" y una botella animada.
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
            viewBox="0 0 640 700"
            role="img"
            aria-label="Botella de Malbec Sorbo junto a una copa de vino tinto"
            className="h-auto w-full max-w-[640px] overflow-visible"
          >
            <defs>
              <linearGradient id="hero-glass-g" x1="0" x2="1">
                <stop offset="0" stopColor="#0B0204" />
                <stop offset=".16" stopColor="#3D0C17" />
                <stop offset=".3" stopColor="#170508" />
                <stop offset=".82" stopColor="#0A0203" />
                <stop offset="1" stopColor="#2E0912" />
              </linearGradient>
              <linearGradient id="hero-sheen-g" x1="0" x2="1">
                <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset=".5" stopColor="#FFFFFF" stopOpacity=".32" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hero-foil-g" x1="0" x2="1">
                <stop offset="0" stopColor="#3A0912" />
                <stop offset=".45" stopColor="#9A2A40" />
                <stop offset="1" stopColor="#2A070D" />
              </linearGradient>
              <linearGradient id="hero-wine-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#A8243F" />
                <stop offset="1" stopColor="#4A0815" />
              </linearGradient>
              <clipPath id="hero-bottle-clip">
                <path d={BOTTLE} />
              </clipPath>
              <clipPath id="hero-bowl-clip">
                <path d={BOWL} />
              </clipPath>
            </defs>

            <ellipse cx="350" cy="634" rx="250" ry="16" fill="#000" opacity=".4" />

            <g className="hero-bottle">
              <path d={BOTTLE} fill="url(#hero-glass-g)" />
              <rect x="227" y="62" width="46" height="120" rx="6" fill="url(#hero-foil-g)" />
              <rect x="224" y="60" width="52" height="14" rx="5" fill="#9A2A40" />
              <rect x="232" y="196" width="36" height="20" rx="2" fill="#E0C58A" />
              <rect x="184" y="398" width="132" height="160" rx="4" fill="#EFE4CD" />
              <rect x="192" y="406" width="116" height="144" rx="2" fill="none" stroke="#A88532" strokeWidth="1.2" />
              <text
                x="250"
                y="458"
                textAnchor="middle"
                fontStyle="italic"
                fontWeight="600"
                fontSize="32"
                fill="#6D1A2E"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Sorbo
              </text>
              <rect x="222" y="472" width="56" height="1.5" fill="#A88532" />
              <text
                x="250"
                y="500"
                textAnchor="middle"
                fontWeight="700"
                fontSize="13"
                letterSpacing="4"
                fill="#2A1A1C"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                MALBEC
              </text>
              <text
                x="250"
                y="520"
                textAnchor="middle"
                fontWeight="600"
                fontSize="10"
                letterSpacing="3"
                fill="#4A3833"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                RESERVA
              </text>
              <path d="M188 364 V594" stroke="rgba(255,255,255,.13)" strokeWidth="7" strokeLinecap="round" />
              <path d="M240 92 V236" stroke="rgba(255,255,255,.12)" strokeWidth="3" strokeLinecap="round" />
              <g clipPath="url(#hero-bottle-clip)">
                <rect className="hero-sheen" x="90" y="40" width="64" height="620" fill="url(#hero-sheen-g)" />
              </g>
            </g>

            <g className="hero-glass">
              <g clipPath="url(#hero-bowl-clip)">
                <path
                  className="hero-wave"
                  d="M300 446 Q330 436 360 446 T420 446 T480 446 T540 446 T600 446 T660 446 T720 446 V540 H300 Z"
                  fill="url(#hero-wine-g)"
                />
              </g>
              <path d={BOWL} fill="rgba(255,255,255,.05)" stroke="rgba(255,240,230,.6)" strokeWidth="2" />
              <path
                d="M432 388 C431 430 442 470 458 490"
                fill="none"
                stroke="rgba(255,255,255,.35)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <rect x="477" y="518" width="6" height="104" fill="rgba(255,240,230,.55)" />
              <ellipse cx="480" cy="624" rx="50" ry="8" fill="rgba(255,240,230,.18)" stroke="rgba(255,240,230,.55)" strokeWidth="2" />
            </g>

            <g fill="#E0C58A">
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
          href="#combos"
          aria-label="Bajar a los combos"
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
