import type { Metadata, Viewport } from "next";
import { Arimo } from "next/font/google";
import { IDIOMA_ORIGINAL, IDIOMAS, ruta } from "@/lib/idiomas";
import { SITIO } from "@/lib/sitio";
import { TEXTOS } from "@/lib/textos";
import "./globals.css";

// 404 de las URL sin ruta. El layout raíz está bajo [lang] y Next no puede componerla con él: documento completo, en todos los idiomas.

const arimo = Arimo({ variable: "--font-arimo", subsets: ["latin"], display: "swap", weight: ["400", "700"], preload: false });

export const metadata: Metadata = {
  title: `404 | ${SITIO.nombre}`,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0B0C0C", colorScheme: "dark" };

export default function NoEncontradoGlobal() {
  const otros = IDIOMAS.filter((i) => i !== IDIOMA_ORIGINAL);
  const t = TEXTOS[IDIOMA_ORIGINAL].noEncontrado;
  return (
    <html lang={IDIOMA_ORIGINAL} className={`${arimo.variable} h-full antialiased`}>
      <body className="grano flex min-h-full flex-col">
        <header className="cabecera marco flex items-center justify-between gap-6 pb-3 sm:pb-5 sm:pt-5">
          <a href={ruta(IDIOMA_ORIGINAL)} className="inline-block" aria-label={TEXTOS[IDIOMA_ORIGINAL].inicio}>
            <span className="inline-block">
              <span className="titular block text-[0.95rem] leading-[0.92]" aria-hidden="true">
                Sideral
                <br />
                Techno
              </span>
              <span className="sr-only">{SITIO.nombre}</span>
              <span className="mt-1.5 block h-[2px] w-6 bg-rojo" />
            </span>
          </a>
        </header>
        <main className="marco flex-1 py-24 sm:py-32">
          <p className="etiqueta mb-4">404</p>
          <h1 className="titular text-[clamp(2.4rem,7vw,5rem)]">{t.titulo}</h1>
          <span className="regla mt-6" />
          <p className="mt-8 max-w-prose text-lg text-gris">{t.texto}</p>
          <a href={ruta(IDIOMA_ORIGINAL)} className="boton mt-10">{t.volver}</a>
          {otros.map((i) => (
            <section key={i} lang={i} className="mt-16 max-w-prose border-t border-linea pt-10">
              <p className="titular text-2xl">{TEXTOS[i].noEncontrado.titulo}</p>
              <p className="mt-4 text-gris">{TEXTOS[i].noEncontrado.texto}</p>
              <a href={ruta(i)} hrefLang={i} className="boton-secundario mt-6">{TEXTOS[i].noEncontrado.volver}</a>
            </section>
          ))}
        </main>
      </body>
    </html>
  );
}
