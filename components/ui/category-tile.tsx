import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const svg = (p: P): P => ({
  width: 30,
  height: 30,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
  ...p,
});

/** Íconos de línea por categoría (decorativos: el nombre va en texto). */
export function CategoryIcon({ id, ...p }: { id: string } & P) {
  switch (id) {
    case "tintos":
      return (
        <svg {...svg(p)}>
          <path d="M8 3h8l-.4 6.2a3.6 3.6 0 0 1-7.2 0L8 3z" />
          <path d="M8.2 7h7.6M12 12.8V20M8.5 20h7" />
        </svg>
      );
    case "blancos":
      return (
        <svg {...svg(p)}>
          <path d="M10 3h4v4.5l1.6 2.7V20.5H8.4V10.2L10 7.5V3z" />
          <path d="M8.4 14h7.2" />
        </svg>
      );
    case "espumantes":
      return (
        <svg {...svg(p)}>
          <path d="M9 3h6l-.5 8.2a2.5 2.5 0 0 1-5 0L9 3z" />
          <path d="M12 13.7V20M9 20h6M17.5 4.5v.01M19 7v.01M17 8.5v.01" />
        </svg>
      );
    case "cervezas":
      return (
        <svg {...svg(p)}>
          <path d="M5 8h10v12H5zM15 10.5h2.2a2 2 0 0 1 0 4.5H15" />
          <path d="M5 8c0-2.4 2-3 3-2.2 1-1.4 4-1 4 .8.6-.4 3 0 3 1.4M8.5 11.5v5M11.5 11.5v5" />
        </svg>
      );
    case "whisky":
      return (
        <svg {...svg(p)}>
          <path d="M5.5 5h13l-1.4 15H6.9L5.5 5z" />
          <path d="M6.2 12h11.6M10 8v.01M13.5 8.5v.01" />
        </svg>
      );
    case "fernet":
      return (
        <svg {...svg(p)}>
          <path d="M10.5 3h3v3l2 2.5V21h-7V8.5l2-2.5V3z" />
          <path d="M8.5 12.5h7v4h-7z" />
        </svg>
      );
    case "destilados":
      return (
        <svg {...svg(p)}>
          <path d="M4 5h16l-8 8-8-8z" />
          <path d="M12 13v7M8 20h8M16.5 3l-2 3" />
        </svg>
      );
    case "mixers":
      return (
        <svg {...svg(p)}>
          <path d="M12 3.5l7 4v8l-7 4-7-4v-8l7-4z" />
          <path d="M5 7.5l7 4 7-4M12 11.5v8" />
        </svg>
      );
    case "combos":
      return (
        <svg {...svg(p)}>
          <path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13" />
          <path d="M12 7C9.5 3.5 6 5.5 8.5 7M12 7c2.5-3.5 6-1.5 3.5 0" />
        </svg>
      );
    default:
      return (
        <svg {...svg(p)}>
          <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
        </svg>
      );
  }
}

