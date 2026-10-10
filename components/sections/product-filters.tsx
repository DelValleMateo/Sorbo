"use client";

import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Checkbox, Dialog, Popover, Select } from "radix-ui";
import { CategorySelect } from "@/components/ui/category-select";
import { CheckIcon, ChevronDownIcon, CloseIcon, FilterIcon, SearchIcon } from "@/components/ui/icons";
import { PriceRange } from "@/components/ui/price-range";
import { CATEGORIES } from "@/data/categories";
import { SELLABLES } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import {
  applyFilters,
  buildHref,
  categoryName,
  PRICE_BOUNDS,
  rangeToFilter,
  SORTS,
  type Filters,
  type SortId,
} from "@/lib/filters";
import { useUi } from "@/lib/ui-store";
import { btn } from "@/lib/ui";

const BASE = "/productos";
const CAT_LIST = CATEGORIES.filter((c) => c.id !== "todo");

const toggleCats = (cats: string[], id: string) =>
  cats.includes(id) ? cats.filter((c) => c !== id) : [...cats, id];

const rangeOf = (f: Pick<Filters, "min" | "max">): [number, number] => [
  f.min ?? PRICE_BOUNDS.min,
  f.max ?? PRICE_BOUNDS.max,
];

const priceLabel = (f: Pick<Filters, "min" | "max">) =>
  `${formatPrice(f.min ?? PRICE_BOUNDS.min)} – ${formatPrice(f.max ?? PRICE_BOUNDS.max)}${f.max == null ? "+" : ""}`;

const sectionTitle = "mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-wine";

/** Control de la barra de herramientas: misma altura y forma para todos. */
const toolCls =
  "h-12 items-center justify-between gap-2.5 rounded-xl border border-line bg-white px-4 text-[15px] font-bold text-ink transition-colors hover:border-wine data-[state=open]:border-wine";

const chipCls =
  "inline-flex h-10 items-center gap-2 rounded-lg bg-cream px-3 text-sm font-bold text-wine no-underline hover:bg-white";

interface Props {
  filters: Filters;
  total: number;
  /** Resultados por categoría con búsqueda y precio aplicados */
  counts: Record<string, number>;
  /** Resultados sin filtrar por categoría */
  allCount: number;
}

/* ------------------------------------------------------------------ */
/* Precio (desktop/tablet): panel desplegable con slider y "Aplicar"    */
/* ------------------------------------------------------------------ */

function PricePopover({ filters }: { filters: Filters }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<[number, number]>(rangeOf(filters));
  const active = filters.min !== null || filters.max !== null;
  const preview = applyFilters(SELLABLES, { ...filters, ...rangeToFilter(range) }).length;

  const go = (r: [number, number]) => {
    router.push(buildHref(BASE, { ...filters, ...rangeToFilter(r) }), { scroll: false });
    setOpen(false);
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(o) => {
        if (o) setRange(rangeOf(filters));
        setOpen(o);
      }}
    >
      <Popover.Trigger className={`${toolCls} hidden md:inline-flex ${active ? "border-wine text-wine" : ""}`}>
        <span>{active ? priceLabel(filters) : "Precio"}</span>
        <ChevronDownIcon width={18} height={18} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-[60] w-80 rounded-2xl border border-line bg-cream p-5 text-ink shadow-hero"
        >
          <p id="popover-precio" className={sectionTitle}>
            Rango de precio
          </p>
          <PriceRange labelId="popover-precio" value={range} onValueChange={setRange} />
          <div className="mt-4 grid grid-cols-[auto_1fr] gap-2">
            <button
              type="button"
              onClick={() => go([PRICE_BOUNDS.min, PRICE_BOUNDS.max])}
              className={btn("outline", "sm")}
            >
              Limpiar
            </button>
            <button type="button" onClick={() => go(range)} className={btn("primary", "sm")}>
              Ver {preview} {preview === 1 ? "producto" : "productos"}
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Filtros en mobile: panel inferior con Aplicar / Limpiar               */
/* ------------------------------------------------------------------ */

interface Draft {
  cats: string[];
  range: [number, number];
}

function MobileFilters({ filters, counts }: { filters: Filters; counts: Record<string, number> }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>({ cats: filters.cats, range: rangeOf(filters) });
  const draftFilters: Filters = { ...filters, cats: draft.cats, ...rangeToFilter(draft.range) };
  const draftCount = applyFilters(SELLABLES, draftFilters).length;
  const activeCount = filters.cats.length + (filters.min !== null || filters.max !== null ? 1 : 0);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (o) setDraft({ cats: filters.cats, range: rangeOf(filters) });
        setOpen(o);
      }}
    >
      <Dialog.Trigger className={`${toolCls} inline-flex flex-1 justify-center md:hidden`}>
        <FilterIcon width={18} height={18} className="text-wine" />
        Filtrar
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-wine px-1.5 text-xs text-cream">
            {activeCount}
            <span className="sr-only"> filtros activos</span>
          </span>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 animate-fade bg-ink/50" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] animate-slide-up flex-col rounded-t-3xl bg-cream text-ink shadow-drawer">
          <div aria-hidden="true" className="mx-auto mt-2.5 h-1.5 w-12 rounded-full bg-line-strong" />
          <div className="flex items-center justify-between border-b border-line px-5 py-2">
            <Dialog.Title className="font-serif text-[26px] font-medium">Filtrar</Dialog.Title>
            <Dialog.Close
              aria-label="Cerrar filtros"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line-strong"
            >
              <CloseIcon />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Elegí un rango de precio y una o más categorías, y aplicá los filtros.
          </Dialog.Description>

          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 py-4">
            <div>
              <p id="sheet-precio" className={sectionTitle}>
                Precio
              </p>
              <PriceRange
                labelId="sheet-precio"
                value={draft.range}
                onValueChange={(range) => setDraft((d) => ({ ...d, range }))}
              />
            </div>
            <fieldset>
              <legend className={sectionTitle}>Categoría</legend>
              <ul>
                {CAT_LIST.map((c) => {
                  const id = `f-${c.id}`;
                  return (
                    <li key={c.id} className="border-b border-line-soft last:border-0">
                      <label htmlFor={id} className="flex min-h-14 cursor-pointer items-center gap-3 text-base font-semibold">
                        <Checkbox.Root
                          id={id}
                          checked={draft.cats.includes(c.id)}
                          onCheckedChange={(v) =>
                            setDraft((d) => ({
                              ...d,
                              cats: v === true ? [...d.cats, c.id] : d.cats.filter((x) => x !== c.id),
                            }))
                          }
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 border-field bg-white data-[state=checked]:border-wine data-[state=checked]:bg-wine"
                        >
                          <Checkbox.Indicator className="text-cream">
                            <CheckIcon width={16} height={16} />
                          </Checkbox.Indicator>
                        </Checkbox.Root>
                        <span className="flex-1">{c.label}</span>
                        <span className="text-sm font-normal text-muted">{counts[c.id] ?? 0}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-line bg-sand px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
            <button
              type="button"
              onClick={() => setDraft({ cats: [], range: [PRICE_BOUNDS.min, PRICE_BOUNDS.max] })}
              className={btn("outline", "lg", "px-5")}
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={() => {
                router.push(buildHref(BASE, draftFilters), { scroll: false });
                setOpen(false);
              }}
              className={btn("primary", "lg", "px-4")}
            >
              Ver {draftCount} {draftCount === 1 ? "resultado" : "resultados"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Filtros del catálogo: categorías + barra de herramientas + chips      */
/* ------------------------------------------------------------------ */

export function CatalogFilters({ filters, total, counts, allCount }: Props) {
  const router = useRouter();
  const announce = useUi((s) => s.announce);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    announce(`${total} ${total === 1 ? "resultado" : "resultados"}.`);
  }, [total]); // eslint-disable-line react-hooks/exhaustive-deps

  const priceActive = filters.min !== null || filters.max !== null;
  const hasActive = filters.cats.length > 0 || filters.q !== "" || priceActive;

  return (
    <div className="flex flex-col gap-5 text-cream">
      {/* 1. Barra de herramientas: buscar · categoría · precio · ordenar */}
      <div className="flex flex-col gap-2 rounded-2xl bg-cream p-2 text-ink shadow-soft ring-1 ring-gold/25 lg:flex-row lg:items-center">
        <Form action={BASE} role="search" key={filters.q} className="relative flex-1">
          <label htmlFor="catalogo-buscar" className="sr-only">
            Buscar en el catálogo
          </label>
          {filters.cats.length > 0 && <input type="hidden" name="cat" value={filters.cats.join(",")} />}
          {filters.min !== null && <input type="hidden" name="min" value={filters.min} />}
          {filters.max !== null && <input type="hidden" name="max" value={filters.max} />}
          {filters.orden !== "relevancia" && <input type="hidden" name="orden" value={filters.orden} />}
          <SearchIcon
            width={20}
            height={20}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            id="catalogo-buscar"
            name="q"
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            defaultValue={filters.q}
            placeholder="Buscá por nombre: Malbec, gin, combo asado…"
            className="h-12 w-full rounded-xl border border-transparent bg-white pl-12 pr-4 text-base text-ink transition-colors hover:border-line focus:border-wine"
          />
        </Form>

        <div className="flex gap-2">
          <MobileFilters filters={filters} counts={counts} />
          <CategorySelect
            value={filters.cats.length === 0 ? "todo" : filters.cats.length === 1 ? filters.cats[0] : ""}
            onValueChange={(id) =>
              router.push(buildHref(BASE, { ...filters, cats: id === "todo" ? [] : [id] }), { scroll: false })
            }
            counts={counts}
            total={allCount}
            placeholder={`${filters.cats.length} categorías`}
            className="hidden flex-1 md:inline-flex lg:w-64 lg:flex-none"
          />
          <PricePopover key={`${filters.min}-${filters.max}`} filters={filters} />

          <Select.Root
            value={filters.orden}
            onValueChange={(v) => router.push(buildHref(BASE, { ...filters, orden: v as SortId }), { scroll: false })}
          >
            <Select.Trigger aria-label="Ordenar por" className={`${toolCls} inline-flex min-w-0 flex-1 lg:min-w-52 lg:flex-none`}>
              <span className="truncate">
                <span className="hidden font-normal text-muted sm:inline">Ordenar: </span>
                <Select.Value />
              </span>
              <Select.Icon>
                <ChevronDownIcon width={18} height={18} />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position="popper"
                sideOffset={8}
                className="z-[60] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-line bg-cream text-ink shadow-hero"
              >
                <Select.Viewport className="p-1">
                  {SORTS.map((s) => (
                    <Select.Item
                      key={s.id}
                      value={s.id}
                      className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-semibold outline-none data-[highlighted]:bg-sand data-[state=checked]:text-wine"
                    >
                      <Select.ItemText>{s.label}</Select.ItemText>
                      <Select.ItemIndicator className="ml-auto">
                        <CheckIcon width={16} height={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      {/* 2. Resultados y filtros activos */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-[15px]">
          <strong className="font-extrabold">{total}</strong> {total === 1 ? "producto" : "productos"}
          {filters.q && (
            <>
              {" "}
              para <strong className="font-extrabold">“{filters.q}”</strong>
            </>
          )}
        </p>
        {hasActive && (
          <ul aria-label="Filtros activos" className="flex flex-wrap items-center gap-2">
            {filters.cats.map((id) => (
              <li key={id}>
                <Link
                  href={buildHref(BASE, { ...filters, cats: toggleCats(filters.cats, id) })}
                  scroll={false}
                  aria-label={`Quitar filtro ${categoryName(id)}`}
                  className={chipCls}
                >
                  {categoryName(id)}
                  <CloseIcon width={14} height={14} />
                </Link>
              </li>
            ))}
            {priceActive && (
              <li>
                <Link
                  href={buildHref(BASE, { ...filters, min: null, max: null })}
                  scroll={false}
                  aria-label="Quitar filtro de precio"
                  className={chipCls}
                >
                  {priceLabel(filters)}
                  <CloseIcon width={14} height={14} />
                </Link>
              </li>
            )}
            {filters.q && (
              <li>
                <Link
                  href={buildHref(BASE, { ...filters, q: "" })}
                  scroll={false}
                  aria-label={`Quitar búsqueda ${filters.q}`}
                  className={chipCls}
                >
                  “{filters.q}”
                  <CloseIcon width={14} height={14} />
                </Link>
              </li>
            )}
            <li>
              <Link
                href={BASE}
                scroll={false}
                className="inline-flex min-h-11 items-center px-2 text-sm font-bold text-cream underline underline-offset-4 hover:text-gold"
              >
                Limpiar todo
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
