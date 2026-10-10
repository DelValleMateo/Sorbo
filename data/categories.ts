import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  { id: "todo", label: "Todo" },
  { id: "tintos", label: "Tintos", short: "tintos" },
  { id: "blancos", label: "Blancos y rosados", short: "blancos" },
  { id: "espumantes", label: "Espumantes", short: "espumantes" },
  { id: "cervezas", label: "Cervezas" },
  { id: "whisky", label: "Whisky" },
  { id: "fernet", label: "Fernet y aperitivos" },
  { id: "destilados", label: "Gin, vodka y ron" },
  { id: "mixers", label: "Hielo y mixers" },
  { id: "combos", label: "Combos" },
];

export const categoryLabel = (id: string) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? "";
