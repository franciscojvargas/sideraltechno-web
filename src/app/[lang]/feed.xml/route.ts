import fs from "node:fs";
import path from "node:path";
import { enIdioma, videosPublicados } from "@/lib/content";
import { fechaISO } from "@/lib/fechas";
import { IDIOMAS, esIdioma, ruta } from "@/lib/idiomas";
import { SITIO } from "@/lib/sitio";
import { TEXTOS } from "@/lib/textos";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const IDIOMA_RSS = { es: "es-es", en: "en-gb" } as const;

// RSS pide el tamaño real de la imagen en bytes.
const tamano = (id: string) => {
  try {
    return fs.statSync(path.join(process.cwd(), "public", "portadas", `${id}.jpg`)).size;
  } catch {
    return 0;
  }
};

export function generateStaticParams() {
  return IDIOMAS.map((lang) => ({ lang }));
}

// Un canal por idioma: /feed.xml (español) y /en/feed.xml.
export async function GET(_peticion: Request, { params }: RouteContext<"/[lang]/feed.xml">) {
  const { lang } = await params;
  if (!esIdioma(lang)) return new Response(null, { status: 404 });
  const portada = `${SITIO.url}${ruta(lang)}`.replace(/\/$/, "");
  const items = videosPublicados()
    .map((original) => {
      const v = enIdioma(original, lang);
      const url = `${SITIO.url}${ruta(lang, `/videos/${v.id}`)}`;
      const fecha = new Date(`${fechaISO(v.publicado)}T09:00:00Z`).toUTCString();
      return `<item><title>${esc(v.titulo)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${fecha}</pubDate>${v.serie ? `<category>${esc(v.serie)}</category>` : ""}<description>${esc(v.resumen)}</description><enclosure url="${SITIO.url}/portadas/${v.id}.jpg" type="image/jpeg" length="${tamano(v.id)}"/></item>`;
    })
    .join("");
  const propio = `${SITIO.url}${ruta(lang, "/feed.xml")}`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(SITIO.nombre)}</title><link>${portada}</link><description>${esc(TEXTOS[lang].descripcion)}</description><language>${IDIOMA_RSS[lang]}</language><atom:link href="${propio}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
