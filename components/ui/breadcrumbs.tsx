import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/icons";

export interface Crumb {
  label: string;
  href?: string;
}

/** Migas de pan: el último elemento es la página actual (sin enlace). */
export function Breadcrumbs({ crumbs, tone = "light" }: { crumbs: Crumb[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <nav aria-label="Migas de pan">
      <ol className={`flex flex-wrap items-center gap-1 text-sm ${dark ? "text-cream" : "text-muted"}`}>
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1">
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className={`inline-flex min-h-11 items-center underline-offset-4 hover:underline ${
                    dark ? "text-cream hover:text-gold" : "text-muted hover:text-wine"
                  }`}
                >
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={`font-bold ${dark ? "text-cream" : "text-ink"}`}>
                  {c.label}
                </span>
              )}
              {!last && <ChevronRightIcon width={14} height={14} className="opacity-70" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
