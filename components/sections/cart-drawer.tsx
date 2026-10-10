"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { Dialog, RadioGroup } from "radix-ui";
import { AddToCart } from "@/components/ui/add-to-cart";
import { AlertIcon, CartIcon, ChatIcon, CloseIcon } from "@/components/ui/icons";
import { useCart } from "@/lib/cart-store";
import { SITE } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import {
  computeTotals,
  pagoDisponible,
  PAGOS,
  validateOrder,
  whatsappOrderUrl,
  type Entrega,
  type OrderErrors,
  type OrderField,
  type OrderForm,
  type Pago,
} from "@/lib/order";
import { useUi } from "@/lib/ui-store";
import { btn } from "@/lib/ui";

const ENTREGAS: { value: Entrega; label: string; note: string }[] = [
  { value: "envio", label: "Envío a domicilio", note: formatPrice(SITE.shippingCost) },
  { value: "retiro", label: "Retiro en el local", note: "Sin cargo" },
];

const inputCls = (invalid: boolean) =>
  `h-12 w-full rounded-lg border bg-white px-3.5 text-base text-ink transition-colors focus:border-wine ${
    invalid ? "border-wine ring-1 ring-wine" : "border-field"
  }`;

const optionCls =
  "group flex min-h-14 flex-col items-start justify-center gap-0.5 rounded-lg border border-field bg-white px-3 py-2 text-left transition-colors hover:border-wine data-[state=checked]:border-wine data-[state=checked]:bg-wine-tint data-[state=checked]:ring-1 data-[state=checked]:ring-wine data-[disabled]:cursor-not-allowed data-[disabled]:border-line data-[disabled]:bg-sand data-[disabled]:opacity-70";

function RadioDot() {
  return (
    <span
      aria-hidden="true"
      className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-field group-data-[state=checked]:border-wine"
    >
      <RadioGroup.Indicator className="h-2 w-2 rounded-full bg-wine" />
    </span>
  );
}

function ErrorText({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} className="flex items-center gap-1.5 text-sm font-bold text-wine">
      <AlertIcon width={16} height={16} className="shrink-0" />
      {children}
    </p>
  );
}

export function CartDrawer() {
  const open = useUi((s) => s.cartOpen);
  const setOpen = useUi((s) => s.setCartOpen);
  const announce = useUi((s) => s.announce);
  const items = useCart((s) => s.items);
  const form = useCart((s) => s.form);
  const setForm = useCart((s) => s.setForm);
  const remove = useCart((s) => s.remove);
  const [errors, setErrors] = useState<OrderErrors>({});
  const nombreRef = useRef<HTMLInputElement>(null);
  const direccionRef = useRef<HTMLInputElement>(null);
  const pagoRef = useRef<HTMLDivElement>(null);

  const t = computeTotals(items, form);
  const count = t.lines.reduce((a, l) => a + l.qty, 0);
  const envio = form.entrega === "envio";

  const update = <K extends keyof OrderForm>(key: K, value: OrderForm[K]) => {
    setForm(key, value);
    // Tarjeta / QR solo retirando: si pasa a envío, se limpia el método de pago.
    if (key === "entrega" && !pagoDisponible(form.pago, value as Entrega)) {
      setForm("pago", "");
      announce("Tarjeta o QR solo se puede usar retirando en el local. Elegí efectivo o transferencia.");
    }
    setErrors((e) => {
      const next = { ...e };
      delete next[key as OrderField];
      if (key === "entrega") delete next.direccion;
      return next;
    });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validateOrder(form);
    setErrors(errs);
    const fields = Object.keys(errs) as OrderField[];
    if (fields.length) {
      // Llevar el foco al primer dato que falta y anunciar el resumen de errores.
      if (fields[0] === "nombre") nombreRef.current?.focus();
      else if (fields[0] === "direccion") direccionRef.current?.focus();
      else pagoRef.current?.querySelector<HTMLButtonElement>('[role="radio"]')?.focus();
      announce(`Faltan datos para enviar el pedido. ${fields.map((f) => errs[f]).join(" ")}`);
      return;
    }
    window.open(whatsappOrderUrl(items, form), "_blank", "noopener,noreferrer");
    announce("Abrimos WhatsApp con tu pedido. Envialo para confirmarlo.");
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 animate-fade bg-ink/50" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(480px,100vw)] animate-slide-right flex-col bg-cream text-ink shadow-drawer">
          <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-line px-5 md:h-[72px]">
            <div className="flex items-baseline gap-3">
              <Dialog.Title className="font-serif text-[28px] font-medium tracking-tight">Tu pedido</Dialog.Title>
              {count > 0 && (
                <span className="text-sm font-bold text-muted">
                  {count} {count === 1 ? "producto" : "productos"}
                </span>
              )}
            </div>
            <Dialog.Close
              aria-label="Cerrar pedido"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line-strong hover:border-ink"
            >
              <CloseIcon />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Revisá los productos, completá los datos de entrega y enviá el pedido por WhatsApp.
          </Dialog.Description>

          {t.lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
              <span
                aria-hidden="true"
                className="flex h-20 w-20 items-center justify-center rounded-full bg-wine-tint text-wine"
              >
                <CartIcon width={36} height={36} />
              </span>
              <p className="font-serif text-[26px] leading-tight">Tu pedido está vacío</p>
              <p className="max-w-[24em] text-base text-muted">
                Sumá vinos, combos o lo que necesites para tu ocasión.
              </p>
              <div className="mt-2 flex w-full flex-col gap-2 sm:w-auto">
                <Link href="/productos" onClick={() => setOpen(false)} className={btn("primary", "md")}>
                  Explorar el catálogo
                </Link>
                <Link href="/combos" onClick={() => setOpen(false)} className={btn("outline", "md")}>
                  Ver combos
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 overflow-y-auto px-5 pb-6">
                <ul aria-label="Productos en el pedido">
                  {t.lines.map(({ item, qty }) => (
                    <li
                      key={item.id}
                      className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 border-b border-line-soft py-4"
                    >
                      <div className="relative h-20 w-16 overflow-hidden rounded-md bg-white ring-1 ring-line">
                        <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="flex min-w-0 flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-bold leading-tight">{item.name}</p>
                            <p className="text-sm text-muted">
                              {item.kind === "combo" ? "Combo" : item.detail} · {formatPrice(item.price)} c/u
                            </p>
                          </div>
                          <p className="shrink-0 font-extrabold">{formatPrice(item.price * qty)}</p>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <AddToCart item={item} />
                          <button
                            type="button"
                            onClick={() => {
                              remove(item.id);
                              announce(`${item.name} quitado del pedido.`);
                            }}
                            aria-label={`Quitar ${item.name} del pedido`}
                            className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-muted underline underline-offset-4 hover:text-wine"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <section aria-labelledby="datos-entrega" className="mt-7 flex flex-col gap-5">
                  <h3
                    id="datos-entrega"
                    className="text-[13px] font-bold uppercase tracking-[0.18em] text-wine"
                  >
                    Datos de entrega
                  </h3>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pedido-nombre" className="text-sm font-bold">
                      Nombre y apellido
                    </label>
                    <input
                      ref={nombreRef}
                      id="pedido-nombre"
                      type="text"
                      autoComplete="name"
                      autoCapitalize="words"
                      value={form.nombre}
                      onChange={(e) => update("nombre", e.target.value)}
                      aria-required="true"
                      aria-invalid={errors.nombre ? true : undefined}
                      aria-describedby={errors.nombre ? "pedido-nombre-error" : undefined}
                      className={inputCls(!!errors.nombre)}
                    />
                    <ErrorText id="pedido-nombre-error">{errors.nombre}</ErrorText>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <p id="pedido-entrega-label" className="text-sm font-bold">
                      ¿Cómo lo recibís?
                    </p>
                    <RadioGroup.Root
                      aria-labelledby="pedido-entrega-label"
                      value={form.entrega}
                      onValueChange={(v) => update("entrega", v as Entrega)}
                      className="grid grid-cols-2 gap-2"
                    >
                      {ENTREGAS.map((o) => (
                        <RadioGroup.Item key={o.value} value={o.value} className={optionCls}>
                          <span className="flex items-center gap-2 text-sm font-bold">
                            <RadioDot />
                            {o.label}
                          </span>
                          <span className="pl-[26px] text-xs text-muted">{o.note}</span>
                        </RadioGroup.Item>
                      ))}
                    </RadioGroup.Root>
                  </div>

                  {envio && (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pedido-direccion" className="text-sm font-bold">
                        Dirección de entrega
                      </label>
                      <input
                        ref={direccionRef}
                        id="pedido-direccion"
                        type="text"
                        autoComplete="street-address"
                        value={form.direccion}
                        onChange={(e) => update("direccion", e.target.value)}
                        aria-required="true"
                        aria-invalid={errors.direccion ? true : undefined}
                        aria-describedby={`pedido-direccion-ayuda${errors.direccion ? " pedido-direccion-error" : ""}`}
                        className={inputCls(!!errors.direccion)}
                      />
                      <p id="pedido-direccion-ayuda" className="text-sm text-muted">
                        Calle, número, depto y entre calles.
                      </p>
                      <ErrorText id="pedido-direccion-error">{errors.direccion}</ErrorText>
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <p id="pedido-pago-label" className="text-sm font-bold">
                      Método de pago
                    </p>
                    <RadioGroup.Root
                      ref={pagoRef}
                      aria-labelledby="pedido-pago-label"
                      aria-required="true"
                      aria-invalid={errors.pago ? true : undefined}
                      aria-describedby={
                        [envio ? "pedido-pago-ayuda" : "", errors.pago ? "pedido-pago-error" : ""]
                          .filter(Boolean)
                          .join(" ") || undefined
                      }
                      value={form.pago}
                      onValueChange={(v) => update("pago", v as Pago)}
                      className="grid grid-cols-3 gap-2"
                    >
                      {PAGOS.map((p) => {
                        const disponible = pagoDisponible(p, form.entrega);
                        return (
                          <RadioGroup.Item
                            key={p}
                            value={p}
                            disabled={!disponible}
                            className={`${optionCls} ${errors.pago ? "border-wine" : ""}`}
                          >
                            <span className="flex items-center gap-2 text-sm font-bold leading-tight">
                              <RadioDot />
                              {p}
                            </span>
                            {p === "Tarjeta / QR" && (
                              <span className="pl-[26px] text-xs text-muted">
                                {disponible ? "En el local" : "Solo retirando"}
                              </span>
                            )}
                          </RadioGroup.Item>
                        );
                      })}
                    </RadioGroup.Root>
                    {envio && (
                      <p id="pedido-pago-ayuda" className="text-sm text-muted">
                        Con envío a domicilio pagás en efectivo o por transferencia. Tarjeta y QR, solo
                        retirando en el local.
                      </p>
                    )}
                    <ErrorText id="pedido-pago-error">{errors.pago}</ErrorText>
                  </div>
                </section>
              </div>

              <div className="shrink-0 border-t border-line bg-sand px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
                <dl className="flex flex-col gap-1.5 text-[15px] text-muted">
                  <div className="flex justify-between gap-3">
                    <dt>Subtotal</dt>
                    <dd className="font-semibold text-ink">{formatPrice(t.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>{envio ? "Envío a domicilio" : "Retiro en el local"}</dt>
                    <dd className="font-semibold text-ink">{envio ? formatPrice(t.shipping) : "Sin cargo"}</dd>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between gap-3 border-t border-line pt-2 text-ink">
                    <dt className="text-base font-extrabold">Total</dt>
                    <dd className="text-2xl font-extrabold tracking-tight">{formatPrice(t.total)}</dd>
                  </div>
                </dl>
                <button type="submit" className={btn("primary", "lg", "mt-3 w-full")}>
                  <ChatIcon width={20} height={20} />
                  Enviar pedido por WhatsApp
                </button>
                <p className="mt-2 text-center text-[13px] text-muted">
                  Se abre WhatsApp con tu pedido. Te confirmamos disponibilidad y horario.
                </p>
              </div>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
