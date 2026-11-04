import type { MetadataRoute } from "next";
import { videosPublicados } from "@/lib/content";
import { fechaISO } from "@/lib/fechas";
import { IDIOMAS, alternativas, ruta } from "@/lib/idiomas";
import { SITIO } from "@/lib/sitio";

const absoluta = (camino: string) => (camino === "/" ? SITIO.url : `${SITIO.url}${camino}`);
const hreflang = (camino: string) => Object.fromEntries(Object.entries(alternativas(camino)).map(([k, v]) => [k, absoluta(v)]));

export default function sitemap(): MetadataRoute.Sitemap {
  const videos = videosPublicados();
  // La portada cambia con cualquier vídeo nuevo o corregido, no solo con el último publicado.
  const ultima = fechaISO(videos.map((v) => v.actualizado ?? v.publicado ?? "").sort().at(-1));
  return IDIOMAS.flatMap((idioma) => [
    { url: absoluta(ruta(idioma)), lastModified: ultima, changeFrequency: "weekly" as const, priority: 1, alternates: { languages: hreflang("/") } },
    ...videos.map((v) => ({
      url: absoluta(ruta(idioma, `/videos/${v.id}`)),
      lastModified: fechaISO(v.actualizado ?? v.publicado),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [absoluta(`/portadas/${v.id}.jpg`)],
      alternates: { languages: hreflang(`/videos/${v.id}`) },
    })),
  ]);
}
