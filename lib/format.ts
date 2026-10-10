const nf = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

export const formatPrice = (n: number) => `$${nf.format(Math.round(n))}`;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
