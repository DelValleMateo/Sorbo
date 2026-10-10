"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/** Segundos hasta el próximo domingo 23:59:59 (misma regla que el diseño). */
function secondsLeft(now: number) {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  end.setDate(end.getDate() + ((7 - end.getDay()) % 7));
  return Math.max(0, Math.floor((end.getTime() - now) / 1000));
}

/** Contador compacto en una sola píldora: menos ruido visual que cuatro cajas. */
export function Countdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(secondsLeft(Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const units =
    left === null
      ? null
      : {
          d: Math.floor(left / 86400),
          h: Math.floor((left % 86400) / 3600),
          m: Math.floor((left % 3600) / 60),
          s: left % 60,
        };

  return (
    <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-full border border-gold/40 bg-wine-deep/45 py-1.5 pl-3.5 pr-1.5 backdrop-blur-sm">
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-gold">
        <span aria-hidden="true" className="h-2 w-2 animate-pulse-ring rounded-full bg-gold" />
        Promo semanal · termina en
      </span>
      <span role="timer" aria-live="off" className="flex gap-1">
        {units ? (
          <>
            <span className="sr-only">
              {units.d} días, {units.h} horas y {units.m} minutos
            </span>
            {(
              [
                [units.d, "d"],
                [units.h, "h"],
                [units.m, "m"],
                [units.s, "s"],
              ] as const
            ).map(([v, l]) => (
              <span
                key={l}
                aria-hidden="true"
                className="rounded-full bg-cream/12 px-2 py-0.5 text-sm font-extrabold tabular-nums"
              >
                {pad(v)}
                <span className="text-xs font-bold opacity-80">{l}</span>
              </span>
            ))}
          </>
        ) : (
          <span className="px-2 text-sm font-extrabold opacity-80">--</span>
        )}
      </span>
    </div>
  );
}
