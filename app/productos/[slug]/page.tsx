import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductPurchase } from "@/components/sections/product-purchase";
import { Eyebrow, SectionHeading } from "@/components/sections/section-heading";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StoreIcon, TagIcon, TruckIcon } from "@/components/ui/icons";
import { ProductCard } from "@/components/ui/product-card";
import { categoryLabel } from "@/data/categories";
import { getProduct, PRODUCTS } from "@/data/products";
import { discountPct, findSellable, PRODUCT_SELLABLES } from "@/lib/catalog";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/productos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Producto no encontrado" };
  return { title: `${p.name} ${p.detail}`, description: p.description };
}

export default async function ProductPage({ params }: PageProps<"/productos/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  const item = product && findSellable(product.id);
  if (!product || !item) notFound();

  const off = discountPct(product.price, product.oldPrice);
  const catName = categoryLabel(product.cat);
  const sameCat = PRODUCT_SELLABLES.filter((p) => p.cat === product.cat && p.id !== product.id);
  const related = [
    ...sameCat,
    ...PRODUCT_SELLABLES.filter((p) => p.cat !== product.cat && p.stock !== "out"),
  ].slice(0, 4);

  return (
    <>
      <div className="bg-papel pb-24 lg:pb-0">
        <div className="wrap py-6 md:py-10">
          <Breadcrumbs
            crumbs={[
              { label: "Inicio", href: "/" },
              { label: "Catálogo", href: "/productos" },
              { label: catName, href: `/productos?cat=${product.cat}` },
              { label: product.name },
            ]}
          />

          <div className="mt-6 grid items-start gap-8 lg:mt-8 lg:grid-cols-2 lg:gap-14">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-gold/20 lg:sticky lg:top-28">
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                priority
                sizes="(min-width: 1240px) 560px, (min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              {off > 0 && (
                <span className="absolute left-4 top-4 rounded-md bg-wine px-3 py-1.5 text-sm font-extrabold text-cream">
                  −{off}% OFF
                </span>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Eyebrow>{catName}</Eyebrow>
                <h1 className="font-serif text-h1 font-medium text-ink">{product.name}</h1>
                <p className="text-lg text-muted">
                  {product.bodega ? `${product.bodega} · ` : ""}
                  {product.detail}
                </p>
              </div>

              <ProductPurchase item={item} />

              <ul className="grid gap-3 sm:grid-cols-3">
                {[
                  { Icon: TruckIcon, text: "Envío a domicilio" },
                  { Icon: StoreIcon, text: "Retiro sin cargo" },
                  { Icon: TagIcon, text: "Efectivo, transferencia o tarjeta" },
                ].map(({ Icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5 text-sm font-bold text-ink">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wine text-gold"
                    >
                      <Icon width={18} height={18} />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>

              <section aria-labelledby="descripcion" className="flex flex-col gap-3 border-t border-gold-deep/30 pt-6">
                <h2 id="descripcion" className="font-serif text-2xl font-medium text-ink">
                  Descripción
                </h2>
                <p className="text-base leading-relaxed text-ink-soft">{product.description}</p>
                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[15px]">
                  <dt className="font-bold text-muted">Categoría</dt>
                  <dd className="text-ink">{catName}</dd>
                  <dt className="font-bold text-muted">Presentación</dt>
                  <dd className="text-ink">{product.detail}</dd>
                  {product.bodega && (
                    <>
                      <dt className="font-bold text-muted">Bodega</dt>
                      <dd className="text-ink">{product.bodega}</dd>
                    </>
                  )}
                </dl>
              </section>
            </div>
          </div>
        </div>
      </div>

      <section aria-labelledby="relacionados" className="focus-dark border-t border-gold/40 bg-felpa text-cream">
        <div className="wrap flex flex-col gap-8 py-14 md:py-16">
          <SectionHeading
            id="relacionados"
            eyebrow="Para combinar"
            title="También te puede gustar"
            tone="dark"
            action={{ href: `/productos?cat=${product.cat}`, label: `Ver más ${catName.toLowerCase()}` }}
          />
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.id} className="flex">
                <ProductCard item={r} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
