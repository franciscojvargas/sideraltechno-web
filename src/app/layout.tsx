import type { Metadata, Viewport } from "next";
import { Arimo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Cabecera } from "@/components/Cabecera";
import { Pie } from "@/components/Pie";
import { SITIO } from "@/lib/sitio";
import "./globals.css";

const arimo = Arimo({ variable: "--font-arimo", subsets: ["latin"], display: "swap", weight: ["400", "700"], preload: false });

export const ensureStatic = "navigation";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO.url),
  title: { default: `${SITIO.nombre} | ${SITIO.lema}`, template: `%s | ${SITIO.nombre}` },
  description: SITIO.descripcion,
  applicationName: SITIO.nombre,
  alternates: { canonical: "/", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: { type: "website", siteName: SITIO.nombre, locale: "es_ES", url: "/" },
  twitter: { card: "summary_large_image" },
  keywords: ["techno", "cultura techno", "discotecas", "Ruta del Bakalao", "festivales", "música electrónica", "historia del techno", "clubs de España"],
  authors: [{ name: SITIO.nombre, url: SITIO.url }],
  creator: SITIO.nombre,
  formatDetection: { email: false, telephone: false, address: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

export const viewport: Viewport = { themeColor: "#0B0C0C", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${arimo.variable} h-full antialiased`}>
      <body className="grano flex min-h-full flex-col">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-blanco focus:px-3 focus:py-2 focus:text-carbon">
          Saltar al contenido
        </a>
        <Cabecera />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Pie />
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
