import { SectionHeading } from "@/components/sections/section-heading";
import { QuoteIcon, StarIcon } from "@/components/ui/icons";
import { REVIEWS } from "@/data/reviews";

export function Testimonials() {
  return (
    <section aria-labelledby="clientes-title" className="border-t border-gold-deep/40 bg-papel">
      <div className="wrap flex flex-col gap-10 py-16 md:py-20">
        <SectionHeading id="clientes-title" eyebrow="Clientes" title="Lo que dicen de Sorbo" />
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <li key={r.id} className="flex">
              <figure className="relative flex w-full flex-col gap-4 overflow-hidden rounded-2xl bg-cream p-6 shadow-soft ring-1 ring-black/5 md:p-7">
                <QuoteIcon
                  width={56}
                  height={56}
                  className="absolute -right-1 -top-1 text-gold-deep/20"
                />
                <div role="img" aria-label={`${r.rating} de 5 estrellas`} className="flex gap-1 text-gold-deep">
                  {Array.from({ length: 5 }, (_, i) => (
                    <StarIcon key={i} width={18} height={18} className={i < r.rating ? "" : "opacity-25"} />
                  ))}
                </div>
                <blockquote className="flex-1 font-serif text-[21px] italic leading-snug text-ink">
                  “{r.text}”
                </blockquote>
                <figcaption className="flex items-center gap-3 border-t border-line-soft pt-4">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-wine font-serif text-lg text-gold"
                  >
                    {r.author.charAt(0)}
                  </span>
                  <span className="text-[15px] font-bold text-ink">{r.author}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
