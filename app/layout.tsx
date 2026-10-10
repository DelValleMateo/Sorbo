import type { Metadata, Viewport } from "next";
import { Manrope, Newsreader } from "next/font/google";
import { AgeGate } from "@/components/sections/age-gate";
import { CartBar } from "@/components/sections/cart-bar";
import { CartDrawer } from "@/components/sections/cart-drawer";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { LiveRegion } from "@/components/sections/live-region";
import { StoreHydrator } from "@/components/sections/store-hydrator";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Sorbo · Vinoteca y bebidas", template: "%s · Sorbo" },
  description:
    "Tintos, blancos y espumantes elegidos uno por uno, más combos y destilados. Pedí por WhatsApp y te lo llevamos a casa.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6d1a2e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${newsreader.variable} ${manrope.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[80] focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-base focus:font-bold focus:text-cream"
        >
          Saltar al contenido
        </a>
        <StoreHydrator />
        <Header />
        <main id="contenido" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <CartBar />
        <CartDrawer />
        <AgeGate />
        <LiveRegion />
      </body>
    </html>
  );
}
