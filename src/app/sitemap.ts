import type { MetadataRoute } from "next";
import { videosPublicados } from "@/lib/content";
import { fechaISO } from "@/lib/fechas";
import { SITIO } from "@/lib/sitio";

export default function sitemap(): MetadataRoute.Sitemap {
  const videos = videosPublicados();
  const ultima = fechaISO(videos[0]?.actualizado ?? videos[0]?.publicado);
  return [
    { url: SITIO.url, lastModified: ultima, changeFrequency: "weekly", priority: 1 },
    ...videos.map((v) => ({
      url: `${SITIO.url}/videos/${v.id}`,
      lastModified: fechaISO(v.actualizado ?? v.publicado),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [`${SITIO.url}/portadas/${v.id}.jpg`],
    })),
  ];
}
