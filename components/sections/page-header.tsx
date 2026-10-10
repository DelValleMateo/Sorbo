import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";

interface Props {
  title: string;
  description?: string;
  crumbs: Crumb[];
}

/** Encabezado de página interna: mismo terciopelo que el hero, migas de pan y único H1. */
export function PageHeader({ title, description, crumbs }: Props) {
  return (
    <div className="focus-dark relative overflow-hidden border-b border-gold/40 bg-velvet text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_90%_at_85%_30%,color-mix(in_srgb,var(--color-wine-light)_45%,transparent),transparent_70%)]"
      />
      <div className="wrap relative flex flex-col gap-3 py-8 md:py-12">
        <Breadcrumbs crumbs={crumbs} tone="dark" />
        <h1 className="font-serif text-h1 font-medium">{title}</h1>
        {description && <p className="max-w-2xl text-base leading-relaxed md:text-lg">{description}</p>}
      </div>
    </div>
  );
}
