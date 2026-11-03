import Image from "next/image";
import Link from "next/link";
import { Buscador } from "@/components/Buscador";
import { palabrasUnicas } from "@/lib/texto";
import { SeguirInstagram } from "@/components/Redes";
import { todosLosVideos, videosPublicados } from "@/lib/content";
import { MOSTRAR_BORRADORES, SITIO, jsonLd } from "@/lib/sitio";

export default function Inicio() {
  const videos = MOSTRAR_BORRADORES ? todosLosVideos() : videosPublicados();
  const [ultimo] = videos;
  const buscables = videos.map((v) => ({
    id: v.id,
    serie: v.serie,
    titulo: v.titulo,
    estado: v.estado,
    texto: palabrasUnicas([v.titulo, v.resumen, v.serie, v.etiquetas.join(" "), v.lugar?.nombre, v.lugar?.municipio, v.lugar?.provincia, v.cuerpoPlano].filter(Boolean).join(" ")),
  }));

  const datos = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITIO.url}/#web`, name: SITIO.nombre, url: SITIO.url, inLanguage: "es", description: SITIO.descripcion, publisher: { "@id": `${SITIO.url}/#marca` } },
      { "@type": "Organization", "@id": `${SITIO.url}/#marca`, name: SITIO.nombre, url: SITIO.url, logo: `${SITIO.url}/icon.svg`, email: SITIO.correo, sameAs: [SITIO.instagram, SITIO.tiktok] },
      {
        "@type": "ItemList",
        name: "Vídeos de Sideral Techno",
        itemListElement: videos.map((v, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITIO.url}/videos/${v.id}`, name: v.titulo })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(datos) }} />

      <section className="marco grid items-center gap-16 pb-20 pt-10 sm:pt-16 lg:min-h-[calc(100svh-6rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:pb-24">
        <div>
          <p className="etiqueta entra">{SITIO.usuarioInstagram} en Instagram y TikTok</p>
          <h1 className="titular entra entra-2 mt-6 text-[clamp(2.75rem,7.2vw,8.5rem)]">
            Cultura techno
            <br />
            <span className="text-gris">en vídeos cortos.</span>
          </h1>
          <span className="regla entra entra-3 mt-10 w-16" />
          <p className="entra entra-3 mt-10 max-w-lg text-lg leading-relaxed text-gris sm:text-xl">
            Discotecas míticas, festivales, la Ruta del Bakalao y el sonido de la pista. Cada dato, con su fuente.
          </p>
          <div className="entra entra-3 mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <SeguirInstagram />
            <a href="#videos" className="etiqueta enlace text-blanco/80">Ver los {videos.length} vídeos</a>
          </div>
        </div>

        {ultimo && (
          <div className="group entra entra-2 relative mx-auto aspect-[4/5] w-full max-w-[44rem] lg:max-w-[min(44rem,66svh)]">
            {videos.slice(0, 3).map((v, i) => (
              <Link
                key={v.id}
                href={`/videos/${v.id}`}
                className={[
                  "absolute top-1/2 w-[52%] overflow-hidden rounded-sm shadow-2xl shadow-black/70 transition-[translate,scale,opacity] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
                  i === 0 && "left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 hover:-translate-y-[52%]",
                  i === 1 && "left-0 z-20 -translate-y-[44%] scale-[0.86] opacity-60 hover:opacity-100 group-hover:-translate-x-6 group-hover:opacity-90",
                  i === 2 && "right-0 z-10 -translate-y-[56%] scale-[0.86] opacity-60 hover:opacity-100 group-hover:translate-x-6 group-hover:opacity-90",
                ].filter(Boolean).join(" ")}
              >
                {i === 0 && <span className="etiqueta absolute left-3 top-3 z-10 rounded-sm bg-blanco px-2 py-1.5 text-carbon">Nuevo</span>}
                <Image src={`/portadas/${v.id}.webp`} alt={v.titulo} width={720} height={1280} {...(i === 0 ? { loading: "eager", fetchPriority: "high" } : {})} quality={70} sizes="(min-width: 1024px) 22vw, 52vw" className="aspect-[9/16] h-auto w-full object-cover" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section id="videos" aria-labelledby="titulo-videos" className="marco scroll-mt-6">
        <Buscador videos={buscables} correo={SITIO.correo} />
      </section>
    </>
  );
}
