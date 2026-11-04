import type { Metadata, Viewport } from "next";
import { Arimo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Cabecera } from "@/components/Cabecera";
import { Pie } from "@/components/Pie";
import { idiomaActual } from "@/lib/idioma-actual";
import { IDIOMAS, LOCALE_OG, alternativas, ruta } from "@/lib/idiomas";
import { SITIO } from "@/lib/sitio";
import { TEXTOS } from "@/lib/textos";
import "../globals.css";

const arimo = Arimo({ variable: "--font-arimo", subsets: ["latin"], display: "swap", weight: ["400", "700"], preload: false });

export const ensureStatic = "navigation";

export function generateStaticParams() {
  return IDIOMAS.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const idioma = await idiomaActual();
  const t = TEXTOS[idioma];
  return {
    metadataBase: new URL(SITIO.url),
    title: { default: `${SITIO.nombre} | ${t.lema}`, template: `%s | ${SITIO.nombre}` },
    description: t.descripcion,
    applicationName: SITIO.nombre,
    alternates: { canonical: ruta(idioma), languages: alternativas(), types: { "application/rss+xml": "/feed.xml" } },
    openGraph: {
      type: "website",
      siteName: SITIO.nombre,
      locale: LOCALE_OG[idioma],
      alternateLocale: IDIOMAS.filter((i) => i !== idioma).map((i) => LOCALE_OG[i]),
      url: ruta(idioma),
      images: [{ url: ruta(idioma, "/og.png"), width: 1200, height: 630, alt: t.imagen.alt }],
    },
    twitter: { card: "summary_large_image" },
    keywords: t.palabrasClave,
    authors: [{ name: SITIO.nombre, url: SITIO.url }],
    creator: SITIO.nombre,
    formatDetection: { email: false, telephone: false, address: false },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export const viewport: Viewport = { themeColor: "#0B0C0C", colorScheme: "dark" };

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const idioma = await idiomaActual();
  return (
    <html lang={idioma} className={`${arimo.variable} h-full antialiased`}>
      <body className="grano flex min-h-full flex-col">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-blanco focus:px-3 focus:py-2 focus:text-carbon">
          {TEXTOS[idioma].saltar}
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
