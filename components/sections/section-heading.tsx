import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";

type Tone = "light" | "dark";

/** Antetítulo con ornamento: filete + rombo. Marfil sobre felpa, vino sobre crema. */
export function Eyebrow({ children, tone = "light" }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.18em] ${
        tone === "dark" ? "text-gold" : "text-wine"
      }`}
    >
      <span aria-hidden="true" className="h-px w-7 bg-current opacity-70" />
      <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-current" />
      {children}
    </span>
  );
}

interface Props {
  eyebrow: string;
  title: string;
  id: string;
  description?: string;
  /** dark: sobre felpa · light: sobre marfil */
  tone?: Tone;
  /** Atajo "Ver todos" junto al título (desde tablet; en mobile va el botón al pie) */
  action?: { href: string; label: string };
}

export function SectionHeading({ eyebrow, title, id, description, tone = "light", action }: Props) {
  const dark = tone === "dark";
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <div className="flex max-w-2xl flex-col gap-3">
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        <h2
          id={id}
          className={`font-serif text-h2 font-medium [text-wrap:balance] ${dark ? "text-cream" : "text-ink"}`}
        >
          {title}
        </h2>
        {description && (
          <p className={`text-base leading-relaxed md:text-lg ${dark ? "text-cream" : "text-muted"}`}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className={`group hidden min-h-11 items-center gap-2 text-[15px] font-bold underline-offset-4 hover:underline md:inline-flex ${
            dark ? "text-gold hover:text-cream" : "text-wine hover:text-wine-dark"
          }`}
        >
          {action.label}
          <ArrowIcon
            width={18}
            height={18}
            className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </Link>
      )}
    </div>
  );
}
