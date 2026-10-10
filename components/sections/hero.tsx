"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Countdown } from "@/components/sections/countdown";
import { AddToCart } from "@/components/ui/add-to-cart";
import { ArrowIcon, PauseIcon, PlayIcon } from "@/components/ui/icons";
import { Price } from "@/components/ui/price";
import { HERO_COMBO_IDS } from "@/data/combos";
import { discountPct, findSellable, type Sellable } from "@/lib/catalog";
import { btn } from "@/lib/ui";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const WORDS = ["asado.", "cena.", "brindis.", "domingo.", "festejo."];
const SLIDE_MS = 6000;
const WORD_MS = 3000;

// Posiciones fijas (no aleatorias) para que servidor y cliente coincidan.
const BUBBLES = Array.from({ length: 10 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  size: 4 + ((i * 7) % 10),
  duration: 10 + ((i * 5) % 10),
  delay: (i * 13) % 18,
}));

/** Accesos por ocasión: llevan directo al combo correspondiente. */
const OCCASIONS = [
  { label: "Asado", href: "/combos#combo-asado" },
  { label: "Brindis", href: "/combos#combo-brindis" },
  { label: "Previa", href: "/combos#combo-previa" },
  { label: "Cata", href: "/combos#caja-degustacion" },
] as const;

const slides = HERO_COMBO_IDS.map((id) => findSellable(id)).filter(
  (s): s is Sellable => Boolean(s),
);

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const [slide, setSlide] = useState(0);
  const [word, setWord] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);

  // Se pausa con hover, con foco adentro, a pedido del usuario y con movimiento reducido (WCAG 2.2.2).
  const running = !userPaused && !hover && !focusIn && !reduced;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [running, slide]);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setWord((w) => (w + 1) % WORDS.length), WORD_MS);
    return () => clearInterval(t);
  }, [reduced]);

  const go = (i: number) => setSlide((i + slides.length) % slides.length);

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="focus-dark relative overflow-hidden bg-velvet text-cream"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_75%_45%,color-mix(in_srgb,var(--color-wine-light)_50%,transparent),transparent_70%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            className="absolute -bottom-6 animate-rise rounded-full border border-gold/30 bg-cream/5"
            style={{
              left: `${b.x}%`,
              width: b.size,
              height: b.size,
              animationDuration: `${b.duration}s`,
              animationDelay: `-${b.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="wrap relative grid items-center gap-8 py-9 md:py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-10">
        {/* Texto: en mobile va primero y el CTA queda sobre el pliegue */}
        <div className="flex flex-col items-start gap-5">
          <div className="animate-up">
            <Countdown />
          </div>

          <h1 id="hero-title" className="font-serif text-display font-medium">
            <span className="sr-only">Un vino para cada ocasión</span>
            <span aria-hidden="true" className="block animate-up [animation-delay:.08s]">
              Un vino para
            </span>
            <span aria-hidden="true" className="block animate-up [animation-delay:.18s]">
              cada{" "}
              <span className="relative inline-grid italic text-gold">
                {WORDS.map((w, i) => {
                  const on = i === word;
                  const prev = i === (word - 1 + WORDS.length) % WORDS.length;
                  return (
                    <span
                      key={w}
                      className={`col-start-1 row-start-1 whitespace-nowrap transition-[opacity,transform,filter] duration-500 ${
                        on
                          ? "opacity-100"
                          : `opacity-0 blur-[6px] ${prev ? "-translate-y-[0.45em]" : "translate-y-[0.45em]"}`
                      }`}
                    >
                      {w}
                    </span>
                  );
                })}
              </span>
            </span>
          </h1>

          <p className="max-w-[32em] animate-up text-[clamp(16px,1.35vw,19px)] leading-relaxed [animation-delay:.26s] [text-wrap:pretty]">
            Tintos, blancos y espumantes elegidos uno por uno, más combos y destilados. Pedís por
            WhatsApp y te lo llevamos a casa.
          </p>

          <div className="flex w-full animate-up flex-col gap-3 [animation-delay:.34s] sm:w-auto sm:flex-row">
            <Link href="/productos?cat=tintos,blancos,espumantes" className={btn("light", "lg")}>
              Ver vinos <ArrowIcon width={18} height={18} />
            </Link>
            <Link href="/combos" className={btn("outline-light", "lg")}>
              Ver combos
            </Link>
          </div>

          <nav aria-label="Combos por ocasión" className="animate-up [animation-delay:.42s]">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-gold">
              Pedí por ocasión
            </p>
            <ul className="flex flex-wrap gap-2">
              {OCCASIONS.map((o) => (
                <li key={o.label}>
                  <Link
                    href={o.href}
                    className="inline-flex min-h-11 items-center rounded-lg border border-cream/35 bg-cream/5 px-4 text-[15px] font-bold text-cream no-underline transition-colors hover:border-gold hover:bg-cream hover:text-wine"
                  >
                    {o.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Carrusel: selección de la semana */}
        <div
          role="region"
          aria-roledescription="carrusel"
          aria-label="Selección de la semana"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setFocusIn(true)}
          onBlur={() => setFocusIn(false)}
          className="relative flex animate-up flex-col gap-3 [animation-delay:.3s]"
        >
          <div className="relative animate-float">
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-3 translate-y-2 rotate-[3deg] rounded-3xl border border-gold/25 bg-cream/10"
            />
            <div className="relative grid" aria-live={running ? "off" : "polite"}>
              {slides.map((s, i) => {
                const on = i === slide;
                const off = discountPct(s.price, s.oldPrice);
                const dir = i < slide ? -1 : 1;
                return (
                  <article
                    key={s.id}
                    inert={!on}
                    aria-hidden={!on}
                    aria-roledescription="diapositiva"
                    aria-label={`${i + 1} de ${slides.length}: ${s.name}`}
                    style={on ? undefined : { transform: `translateX(${dir * 48}px) scale(.97)` }}
                    className={`col-start-1 row-start-1 flex flex-col overflow-hidden rounded-3xl bg-cream text-ink shadow-hero ring-1 ring-gold/30 transition-[opacity,transform] duration-700 ${
                      on ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                  >
                    <div className="relative aspect-[16/10] bg-white lg:aspect-[2/1]">
                      <Image
                        src={s.image}
                        alt={s.imageAlt}
                        fill
                        priority={i === 0}
                        sizes="(min-width: 1024px) 560px, (min-width: 768px) 90vw, 100vw"
                        className="object-cover"
                      />
                      <span className="absolute left-4 top-4 rounded-md bg-wine-deep px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-gold">
                        Selección de la semana
                      </span>
                      {off > 0 && (
                        <span className="absolute right-4 top-4 flex h-16 w-16 rotate-[8deg] flex-col items-center justify-center rounded-full bg-gold text-lg font-extrabold leading-none text-ink shadow-cta">
                          −{off}%
                          <span className="mt-0.5 text-[11px] font-bold tracking-wider">OFF</span>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-3 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="font-serif text-[clamp(24px,2.3vw,30px)] font-medium leading-none tracking-tight">
                          {s.name}
                        </h2>
                        <Price price={s.price} oldPrice={s.oldPrice} className="text-2xl" stacked />
                      </div>
                      <ul className="flex flex-wrap gap-x-4 gap-y-1">
                        {s.detail.split(" + ").map((it) => (
                          <li key={it} className="flex items-center gap-2 text-[15px] text-ink-soft">
                            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-deep" />
                            {it}
                          </li>
                        ))}
                      </ul>
                      <AddToCart item={s} size="lg" label="Agregar al pedido" className="w-full" />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Controles: puntos con progreso, pausa y flechas */}
          <div className="flex items-center gap-2 px-1">
            <div role="group" aria-label="Elegir combo" className="flex flex-1 items-center">
              {slides.map((s, i) => {
                const on = i === slide;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Ver ${s.name}`}
                    aria-current={on ? "true" : undefined}
                    className="flex h-11 items-center px-1.5"
                  >
                    <span
                      className={`relative block h-1.5 overflow-hidden rounded-full transition-[width] duration-300 ${
                        on ? "w-10 bg-cream/30" : "w-4 bg-cream/40 hover:bg-cream/70"
                      }`}
                    >
                      {on && (
                        <span
                          key={slide}
                          className="absolute inset-0 origin-left animate-progress bg-gold"
                          style={{
                            animationDuration: `${SLIDE_MS}ms`,
                            animationPlayState: running ? "running" : "paused",
                            transform: reduced ? "scaleX(1)" : undefined,
                          }}
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            {!reduced && (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? "Reanudar carrusel" : "Pausar carrusel"}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/50 hover:bg-cream hover:text-wine"
              >
                {userPaused ? <PlayIcon width={16} height={16} /> : <PauseIcon width={16} height={16} />}
              </button>
            )}
            <button
              type="button"
              onClick={() => go(slide - 1)}
              aria-label="Combo anterior"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/50 hover:bg-cream hover:text-wine"
            >
              <ArrowIcon width={18} height={18} className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => go(slide + 1)}
              aria-label="Combo siguiente"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/50 hover:bg-cream hover:text-wine"
            >
              <ArrowIcon width={18} height={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
