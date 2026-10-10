import type { Review } from "@/types";

// Ficticias: el diseño v3 no incluye reseñas.
export const REVIEWS: Review[] = [
  { id: "r1", author: "Lucía M.", rating: 5, text: "Llegó en el día y el Malbec estaba perfecto para el asado.", productSlug: "malbec-reserva-750-ml" },
  { id: "r2", author: "Martín R.", rating: 5, text: "El combo previa salió menos que comprarlo por separado. Muy práctico." },
  { id: "r3", author: "Carolina P.", rating: 4, text: "Buena atención por WhatsApp, me ayudaron a elegir un espumante." },
];
