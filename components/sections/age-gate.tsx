"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AlertDialog } from "radix-ui";
import { Eyebrow } from "@/components/sections/section-heading";
import { btn } from "@/lib/ui";

const KEY = "sorbo-age-ok";
const EVENT = "sorbo-age-change";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

function read(): "yes" | "no" {
  try {
    return localStorage.getItem(KEY) === "1" ? "yes" : "no";
  } catch {
    return "no"; // sin storage: se vuelve a preguntar
  }
}

/** Age gate: se muestra en la primera visita y se recuerda en localStorage. */
export function AgeGate() {
  const stored = useSyncExternalStore<"yes" | "no" | "server">(subscribe, read, () => "server");
  const [denied, setDenied] = useState(false);
  // Abrir recién cuando terminó la hidratación: Radix marca el resto como aria-hidden.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  const confirm = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignorar */
    }
    window.dispatchEvent(new Event(EVENT));
  };

  if (stored !== "no" || !ready) return null;

  return (
    <AlertDialog.Root open>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-[60] animate-fade bg-velvet" />
        <AlertDialog.Content
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="fixed left-1/2 top-1/2 z-[70] flex w-[min(480px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 flex-col gap-5 rounded-3xl bg-cream p-6 text-ink shadow-hero ring-1 ring-gold/40 md:p-9"
        >
          <div className="flex flex-col gap-3">
            <span className="font-serif text-4xl font-semibold tracking-tight text-wine">Sorbo</span>
            <Eyebrow>Vinoteca y bebidas</Eyebrow>
          </div>
          <AlertDialog.Title className="font-serif text-[32px] font-medium leading-tight tracking-tight">
            {denied ? "Todavía no podés ingresar" : "¿Sos mayor de 18 años?"}
          </AlertDialog.Title>
          <AlertDialog.Description className="text-base leading-relaxed text-muted">
            {denied
              ? "La venta de bebidas alcohólicas está prohibida a menores de 18 años. Te esperamos cuando cumplas la mayoría de edad."
              : "Para ver la tienda necesitás ser mayor de edad. La venta de alcohol está prohibida a menores de 18 años."}
          </AlertDialog.Description>
          {denied ? (
            <AlertDialog.Action
              onClick={() => setDenied(false)}
              className={btn("outline", "lg")}
            >
              Volver
            </AlertDialog.Action>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row-reverse">
              <AlertDialog.Action
                onClick={confirm}
                className={btn("primary", "lg", "flex-1")}
              >
                Soy mayor de 18
              </AlertDialog.Action>
              <AlertDialog.Cancel
                onClick={() => setDenied(true)}
                className={btn("outline", "lg", "flex-1")}
              >
                Soy menor de 18
              </AlertDialog.Cancel>
            </div>
          )}
          <p className="text-sm text-muted-2">Beber con moderación.</p>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
