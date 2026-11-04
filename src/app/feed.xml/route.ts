import fs from "node:fs";
import path from "node:path";
import { videosPublicados } from "@/lib/content";
import { fechaISO } from "@/lib/fechas";
import { SITIO } from "@/lib/sitio";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// RSS pide el tamaño real de la imagen en bytes.
const tamano = (id: string) => {
  try {
    return fs.statSync(path.join(process.cwd(), "public", "portadas", `${id}.jpg`)).size;
  } catch {
    return 0;
  }
};

export function GET() {
  const items = videosPublicados()
    .map((v) => {
      const url = `${SITIO.url}/videos/${v.id}`;
      const fecha = new Date(`${fechaISO(v.publicado)}T09:00:00Z`).toUTCString();
      return `<item><title>${esc(v.titulo)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${fecha}</pubDate>${v.serie ? `<category>${esc(v.serie)}</category>` : ""}<description>${esc(v.resumen)}</description><enclosure url="${SITIO.url}/portadas/${v.id}.jpg" type="image/jpeg" length="${tamano(v.id)}"/></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(SITIO.nombre)}</title><link>${SITIO.url}</link><description>${esc(SITIO.descripcion)}</description><language>es-es</language><atom:link href="${SITIO.url}/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
