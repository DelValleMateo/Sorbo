import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (p: P): P => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
  ...p,
});

export const CartIcon = (p: P) => (
  <svg {...base(p)}><path d="M3 4h2l2.2 10.4a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L19.5 8H6" /><circle cx="9" cy="19.5" r="1.3" /><circle cx="17" cy="19.5" r="1.3" /></svg>
);
export const MenuIcon = (p: P) => (
  <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const CloseIcon = (p: P) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const PlusIcon = (p: P) => (
  <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
);
export const MinusIcon = (p: P) => (
  <svg {...base(p)}><path d="M5 12h14" /></svg>
);
export const ArrowIcon = (p: P) => (
  <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowLeftIcon = (p: P) => (
  <svg {...base(p)}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
export const CheckIcon = (p: P) => (
  <svg {...base(p)}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
export const AlertIcon = (p: P) => (
  <svg {...base(p)}><path d="M12 4l9 16H3L12 4z" /><path d="M12 10v4M12 17.5v.01" /></svg>
);
export const XCircleIcon = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>
);
export const PauseIcon = (p: P) => (
  <svg {...base(p)}><path d="M9 6v12M15 6v12" /></svg>
);
export const PlayIcon = (p: P) => (
  <svg {...base(p)} fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5z" /></svg>
);

export const ChevronDownIcon = (p: P) => (
  <svg {...base(p)}><path d="M6 9l6 6 6-6" /></svg>
);
export const FilterIcon = (p: P) => (
  <svg {...base(p)}><path d="M4 6h16M7 12h10M10 18h4" /></svg>
);

export const TruckIcon = (p: P) => (
  <svg {...base(p)}><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.7" /><circle cx="17" cy="17.5" r="1.7" /></svg>
);
export const StoreIcon = (p: P) => (
  <svg {...base(p)}><path d="M4 9l1.5-5h13L20 9M4 9h16M4 9v11h16V9M9 20v-6h6v6" /></svg>
);
export const TagIcon = (p: P) => (
  <svg {...base(p)}><path d="M3 12V4h8l10 10-8 8L3 12z" /><circle cx="7.5" cy="8.5" r="1.3" /></svg>
);
export const ChatIcon = (p: P) => (
  <svg {...base(p)}><path d="M4 5h16v11H9l-5 4V5z" /></svg>
);
export const StarIcon = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" /></svg>
);
export const SearchIcon = (p: P) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></svg>
);
export const ChevronRightIcon = (p: P) => (
  <svg {...base(p)}><path d="M9 6l6 6-6 6" /></svg>
);
export const QuoteIcon = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none"><path d="M10 7H6a2 2 0 0 0-2 2v4h4v4a2 2 0 0 1-2 2v1a4 4 0 0 0 4-4V7zm10 0h-4a2 2 0 0 0-2 2v4h4v4a2 2 0 0 1-2 2v1a4 4 0 0 0 4-4V7z" /></svg>
);
