import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Buscador } from "@/components/Buscador";
import { SeguirInstagram } from "@/components/Redes";
import { todosLosVideos, videosPublicados } from "@/lib/content";
import { idiomaActual, idiomaDesconocido } from "@/lib/idioma-actual";
import { IDIOMAS, ruta } from "@/lib/idiomas";
import { MOSTRAR_BORRADORES, SITIO, jsonLd } from "@/lib/sitio";
import { palabrasUnicas } from "@/lib/texto";
import { TEXTOS } from "@/lib/textos";

export default async function Inicio() {
  if (await idiomaDesconocido()) notFound();
  const idioma = await idiomaActual();
  const t = TEXTOS[idioma];
  const videos = MOSTRAR_BORRADORES ? todosLosVideos() : videosPublicados();
  const [ultimo] = videos;
  const buscables = videos.map((v) => ({
    id: v.id,
    serie: v.serie,
    titulo: v.titulo,
    estado: v.estado,
    texto: palabrasUnicas([v.titulo, v.resumen, v.serie, v.etiquetas.join(" "), v.lugar?.nombre, v.lugar?.municipio, v.lugar?.provincia, v.cuerpoPlano].filter(Boolean).join(" ")),
  }));
  const langContenido = idioma === "es" ? undefined : "es";

  const datos = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITIO.url}/#web`, name: SITIO.nombre, url: SITIO.url, inLanguage: [...IDIOMAS], description: t.descripcion, publisher: { "@id": `${SITIO.url}/#marca` } },
      { "@type": "Organization", "@id": `${SITIO.url}/#marca`, name: SITIO.nombre, url: SITIO.url, logo: `${SITIO.url}/icon.svg`, email: SITIO.correo, sameAs: [SITIO.instagram, SITIO.tiktok] },
      {
        "@type": "ItemList",
        name: t.portada.lista,
        itemListElement: videos.map((v, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITIO.url}${ruta(idioma, `/videos/${v.id}`)}`, name: v.titulo })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(datos) }} />

      <section className="marco grid items-center gap-12 pb-14 pt-10 sm:gap-16 sm:pb-20 sm:pt-16 lg:min-h-[calc(100svh-6rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:pb-24">
        <div>
          <p className="etiqueta entra">{t.portada.etiqueta(SITIO.usuarioInstagram)}</p>
          <h1 className="titular entra entra-2 mt-6 text-[clamp(2.75rem,7.2vw,8.5rem)]">
            {t.portada.titular}
            <br />
            <span className="text-gris">{t.portada.titular2}</span>
          </h1>
          <span className="regla entra entra-3 mt-8 w-16 sm:mt-10" />
          <p className="entra entra-3 mt-8 max-w-lg text-lg leading-relaxed text-gris sm:text-xl">{t.portada.intro}</p>
          <div className="entra entra-3 mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:items-center sm:mt-10">
            <SeguirInstagram className="justify-center" />
            <a href="#videos" className="boton-secundario justify-center border-blanco/35 py-[0.9rem] text-[0.8125rem] font-bold">
              {t.portada.verVideos(videos.length)}
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-6-6 6 6 6-6" /></svg>
            </a>
          </div>
        </div>

        {ultimo && (
          <div className="group entra entra-2 relative mx-auto aspect-square w-full max-w-[44rem] sm:aspect-[4/5] lg:max-w-[min(44rem,66svh)]">
            {videos.slice(0, 3).map((v, i) => (
              <Link
                key={v.id}
                href={ruta(idioma, `/videos/${v.id}`)}
                className={[
                  "absolute top-1/2 w-[52%] overflow-hidden rounded-sm shadow-2xl shadow-black/70 transition-[translate,scale,opacity] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
                  i === 0 && "left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 hover:-translate-y-[52%]",
                  i === 1 && "left-0 z-20 -translate-y-[44%] scale-[0.86] opacity-60 hover:opacity-100 group-hover:-translate-x-6 group-hover:opacity-90",
                  i === 2 && "right-0 z-10 -translate-y-[56%] scale-[0.86] opacity-60 hover:opacity-100 group-hover:translate-x-6 group-hover:opacity-90",
                ].filter(Boolean).join(" ")}
              >
                {i === 0 && <span className="etiqueta absolute left-3 top-3 z-10 rounded-sm bg-blanco px-2 py-1.5 text-carbon">{t.portada.nuevo}</span>}
                <Image src={`/portadas/${v.id}.webp`} alt={v.titulo} lang={langContenido} width={720} height={1280} {...(i === 0 ? { loading: "eager", fetchPriority: "high" } : {})} quality={70} sizes="(min-width: 1024px) 22vw, 52vw" className="aspect-[9/16] h-auto w-full object-cover" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section id="videos" aria-labelledby="titulo-videos" className="marco scroll-mt-24">
        <Buscador videos={buscables} correo={SITIO.correo} idioma={idioma} textos={t.buscador} />
      </section>
    </>
  );
}
