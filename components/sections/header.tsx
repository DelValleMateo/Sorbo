"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Dialog } from "radix-ui";
import { CategoryIcon } from "@/components/ui/category-tile";
import { CartIcon, ChatIcon, CloseIcon, MenuIcon, SearchIcon } from "@/components/ui/icons";
import { SearchForm } from "@/components/ui/search-form";
import { CATEGORIES } from "@/data/categories";
import { selectCount, useCart } from "@/lib/cart-store";
import { SITE } from "@/lib/config";
import { useUi } from "@/lib/ui-store";
import { btn } from "@/lib/ui";

const NAV = [
  { href: "/", label: "Inicio", match: "/" },
  { href: "/productos?cat=tintos,blancos,espumantes", label: "Vinos", match: null },
  { href: "/combos", label: "Combos", match: "/combos" },
  { href: "/productos", label: "Catálogo", match: "/productos" },
] as const;

const MENU_CATS = CATEGORIES.filter((c) => c.id !== "todo");

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const count = useCart(selectCount);
  const setCartOpen = useUi((s) => s.setCartOpen);

  const isActive = (match: string | null) =>
    match === "/"
      ? pathname === "/"
      : match !== null && (pathname === match || pathname.startsWith(`${match}/`));

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/95 text-ink shadow-[0_1px_0_var(--color-gold-deep)] backdrop-blur">
      <div className="wrap flex h-16 items-center gap-1 md:h-[76px] md:gap-4">
        {/* Menú lateral (mobile y tablet) */}
        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Trigger
            aria-label="Abrir menú"
            className="-ml-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-sand hover:text-wine md:hidden"
          >
            <MenuIcon width={26} height={26} />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 animate-fade bg-ink/50" />
            <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[min(340px,88vw)] animate-slide-left flex-col bg-cream text-ink shadow-drawer">
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
                <Dialog.Title className="font-serif text-[30px] font-semibold tracking-tight text-wine">
                  Sorbo
                </Dialog.Title>
                <Dialog.Close
                  aria-label="Cerrar menú"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line-strong hover:border-ink"
                >
                  <CloseIcon />
                </Dialog.Close>
              </div>
              <Dialog.Description className="sr-only">
                Navegación de la tienda, categorías y contacto
              </Dialog.Description>

              <div className="flex-1 overflow-y-auto">
                <nav aria-label="Principal" className="flex flex-col p-3">
                  {NAV.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive(l.match) ? "page" : undefined}
                      className="flex min-h-14 items-center rounded-lg px-3 font-serif text-2xl text-ink no-underline hover:bg-sand hover:text-wine aria-[current=page]:text-wine"
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>

                <div className="border-t border-line px-5 py-5">
                  <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.18em] text-wine">
                    Categorías
                  </h2>
                  <ul className="grid grid-cols-2 gap-2">
                    {MENU_CATS.map((c) => (
                      <li key={c.id}>
                        <Link
                          href={c.id === "combos" ? "/combos" : `/productos?cat=${c.id}`}
                          onClick={() => setMenuOpen(false)}
                          className="flex min-h-12 items-center gap-2 rounded-lg border border-line bg-white/60 px-2.5 text-sm font-bold leading-tight text-ink no-underline hover:border-wine hover:text-wine"
                        >
                          <CategoryIcon id={c.id} width={22} height={22} className="shrink-0 text-wine" />
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="shrink-0 border-t border-line bg-sand p-5">
                <p className="mb-3 text-sm text-muted">¿Dudas con tu pedido? Te asesoramos.</p>
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={btn("primary", "md", "w-full")}
                >
                  <ChatIcon width={20} height={20} />
                  Escribinos por WhatsApp
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <Link
          href="/"
          aria-label="Sorbo, ir al inicio"
          className="font-serif text-[30px] font-semibold leading-none tracking-[-0.02em] text-wine no-underline hover:text-wine-dark md:text-[34px]"
        >
          Sorbo
        </Link>

        <nav aria-label="Principal" className="ml-6 hidden items-center gap-1 md:flex">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.match) ? "page" : undefined}
              className="relative inline-flex h-11 items-center px-3 text-[15px] font-semibold text-ink no-underline after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-gold-deep after:transition-transform hover:text-wine hover:after:scale-x-100 aria-[current=page]:text-wine aria-[current=page]:after:scale-x-100 motion-reduce:after:transition-none"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:gap-3">
          <SearchForm id="buscar-desktop" className="hidden w-64 lg:block xl:w-72" />

          <button
            type="button"
            onClick={() => setSearchOpen((o) => !o)}
            aria-expanded={searchOpen}
            aria-controls={searchOpen ? "buscador-movil" : undefined}
            aria-label={searchOpen ? "Cerrar buscador" : "Abrir buscador"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-sand hover:text-wine lg:hidden"
          >
            {searchOpen ? <CloseIcon width={22} height={22} /> : <SearchIcon width={22} height={22} />}
          </button>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-haspopup="dialog"
            aria-label={`Mi pedido, ${count} ${count === 1 ? "producto" : "productos"}`}
            className="relative inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-wine px-3 text-[15px] font-bold text-cream shadow-btn transition-colors hover:bg-wine-dark md:px-4"
          >
            <CartIcon width={22} height={22} />
            <span className="hidden md:inline">Mi pedido</span>
            {count > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-gold px-1.5 text-xs font-extrabold text-ink ring-2 ring-cream md:static md:ring-0"
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div id="buscador-movil" className="border-t border-line bg-cream lg:hidden">
          <div className="wrap py-3">
            <SearchForm id="buscar-movil" autoFocus onSubmitted={() => setSearchOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
