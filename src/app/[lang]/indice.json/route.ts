import { enIdioma, todosLosVideos, videosPublicados } from "@/lib/content";
import { IDIOMAS, esIdioma } from "@/lib/idiomas";
import { MOSTRAR_BORRADORES } from "@/lib/sitio";
import { palabrasUnicas } from "@/lib/texto";

// Índice del buscador, aparte de la portada: solo lo descarga quien busca, y la portada no crece con cada vídeo.
export function generateStaticParams() {
  return IDIOMAS.map((lang) => ({ lang }));
}

export async function GET(_peticion: Request, { params }: RouteContext<"/[lang]/indice.json">) {
  const { lang } = await params;
  if (!esIdioma(lang)) return new Response(null, { status: 404 });
  const videos = (MOSTRAR_BORRADORES ? todosLosVideos() : videosPublicados()).map((v) => enIdioma(v, lang));
  const indice = Object.fromEntries(
    videos.map((v) => [v.id, palabrasUnicas([v.titulo, v.resumen, v.serie, v.etiquetas.join(" "), v.lugar?.nombre, v.lugar?.municipio, v.lugar?.provincia, v.cuerpoPlano].filter(Boolean).join(" "))]),
  );
  return Response.json(indice, { headers: { "cache-control": "public, max-age=3600" } });
}
