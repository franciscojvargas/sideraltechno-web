import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { ListaFuentes } from "@/components/Fuentes";
import { Cuadricula } from "@/components/Cuadricula";
import { IconoInstagram, SeguirInstagram } from "@/components/Redes";
import { todosLosVideos, urlInstagram, urlTiktok, videoPorId, videosPublicados } from "@/lib/content";
import { fechaISO, fechaLarga } from "@/lib/fechas";
import { MOSTRAR_BORRADORES, SITIO, mailto, jsonLd } from "@/lib/sitio";

function visibles() {
  return MOSTRAR_BORRADORES ? todosLosVideos() : videosPublicados();
}

function columnasCifras(n: number) {
  if (n === 1) return "";
  if (n === 3) return "md:grid-cols-3";
  if (n === 4) return "sm:grid-cols-2 2xl:grid-cols-4";
  if (n > 4) return "sm:grid-cols-2 xl:grid-cols-3";
  return "sm:grid-cols-2";
}

export function generateStaticParams() {
  return visibles().map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: PageProps<"/videos/[id]">): Promise<Metadata> {
  const { id } = await params;
  const v = videoPorId(id);
  if (!v || (v.estado !== "publicado" && !MOSTRAR_BORRADORES)) return {};
  return {
    title: v.titulo,
    description: v.resumen,
    alternates: { canonical: `/videos/${v.id}` },
    keywords: v.etiquetas,
    openGraph: {
      type: "article",
      title: v.titulo,
      description: v.resumen,
      url: `/videos/${v.id}`,
      publishedTime: fechaISO(v.publicado),
      modifiedTime: fechaISO(v.actualizado),
      section: v.serie,
      tags: v.etiquetas,
      images: [{ url: `/videos/${v.id}/opengraph-image`, width: 1200, height: 630, alt: v.titulo }],
    },
    robots: v.estado === "publicado" ? undefined : { index: false, follow: false },
  };
}

export default async function PaginaVideo({ params }: PageProps<"/videos/[id]">) {
  const { id } = await params;
  const v = videoPorId(id);
  if (!v || (v.estado !== "publicado" && !MOSTRAR_BORRADORES)) notFound();

  const ig = urlInstagram(v);
  const tt = urlTiktok(v);
  const url = `${SITIO.url}/videos/${v.id}`;
  const fuentesPorClave = new Map(v.fuentes.map((f, i) => [f.clave, i + 1]));
  const creditos = [...(v.creditos.imagenes ?? []), v.creditos.musica, v.creditos.mapa, ...(v.creditos.otros ?? []), v.creditos.voz].filter(Boolean);
  const otros = visibles().filter((x) => x.id !== v.id);
  const mas = [...otros.filter((x) => v.relacionados.includes(x.id)), ...otros.filter((x) => !v.relacionados.includes(x.id))].slice(0, 6);

  const datos = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: v.titulo,
        description: v.resumen,
        inLanguage: "es",
        datePublished: fechaISO(v.publicado),
        dateModified: fechaISO(v.actualizado ?? v.publicado),
        author: { "@id": `${SITIO.url}/#marca` },
        publisher: { "@type": "Organization", "@id": `${SITIO.url}/#marca`, name: SITIO.nombre, url: SITIO.url, sameAs: [SITIO.instagram, SITIO.tiktok] },
        mainEntityOfPage: url,
        image: `${SITIO.url}/portadas/${v.id}.jpg`,
        articleSection: v.serie,
        keywords: v.etiquetas.join(", "),
        citation: v.fuentes.filter((f) => f.url).map((f) => ({ "@type": "CreativeWork", name: f.titulo ?? f.medio, url: f.url, publisher: f.medio })),
        ...(ig && {
          video: {
            "@type": "VideoObject",
            name: v.titulo,
            description: v.resumen,
            thumbnailUrl: `${SITIO.url}/portadas/${v.id}.jpg`,
            uploadDate: fechaISO(v.publicado),
            duration: v.duracion ? `PT${Math.round(v.duracion)}S` : undefined,
            embedUrl: `${ig}embed/`,
            contentUrl: v.video,
            url: ig,
          },
        }),
        ...(v.lugar && { contentLocation: { "@type": "Place", name: v.lugar.nombre, address: [v.lugar.municipio, v.lugar.provincia, v.lugar.pais].filter(Boolean).join(", "), ...(v.lugar.lat ? { geo: { "@type": "GeoCoordinates", latitude: v.lugar.lat, longitude: v.lugar.lon } } : {}) } }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITIO.nombre, item: SITIO.url },
          { "@type": "ListItem", position: 2, name: v.titulo, item: url },
        ],
      },
    ],
  };

  const portada = (
    <Image src={`/portadas/${v.id}.webp`} alt={v.titulo} width={720} height={1280} loading="eager" fetchPriority="high" quality={70} sizes="(min-width: 1024px) 26rem, 90vw" className="aspect-[9/16] h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
  );

  return (
    <article className="marco">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(datos) }} />

      <nav aria-label="Migas" className="etiqueta pb-10 pt-4">
        <Link href="/" className="enlace">Vídeos</Link>
        <span className="px-2 text-gris-2">/</span>
        <span className="text-blanco/80">{v.serie ?? v.titulo}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[minmax(17rem,26rem)_minmax(0,1fr)] lg:gap-20 xl:gap-28">
        <div className="mx-auto w-full max-w-[24rem] lg:sticky lg:top-8 lg:mx-0 lg:max-w-none lg:self-start">
          {v.video ? (
            <video controls playsInline preload="none" poster={`/portadas/${v.id}.jpg`} className="aspect-[9/16] w-full rounded-sm bg-carbon-2" src={v.video}>
              Tu navegador no reproduce este vídeo. <a href={v.video}>Descárgalo</a>.
            </video>
          ) : ig ? (
            <a href={ig} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-sm bg-carbon-2" aria-label={`Ver «${v.titulo}» en Instagram`}>
              {portada}
              <span className="absolute bottom-5 right-5 flex h-16 w-16 items-center justify-center rounded-full bg-blanco text-carbon shadow-2xl shadow-black/60 transition-transform duration-300 group-hover:scale-110">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-7 w-7" fill="currentColor"><path d="M7 4.5v15l12.5-7.5z" /></svg>
              </span>
            </a>
          ) : (
            <div className="overflow-hidden rounded-sm">{portada}</div>
          )}
          {ig && (
            <a href={ig} target="_blank" rel="noopener noreferrer" className="boton mt-4 w-full justify-center">
              <IconoInstagram /> Ver en Instagram
            </a>
          )}
          {tt && <p className="mt-3 text-center text-xs text-gris">También en <a href={tt} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-blanco">TikTok</a></p>}
        </div>

        <div className="min-w-0">
          <p className="etiqueta flex flex-wrap gap-x-5 gap-y-2 tabular-nums">
            {v.serie && <span>{v.serie}</span>}
            {v.publicado && <time dateTime={fechaISO(v.publicado)}>{fechaLarga(v.publicado)}</time>}
            {v.lugar && <span>{[v.lugar.municipio ?? v.lugar.nombre, v.lugar.provincia].filter(Boolean).join(", ")}</span>}
            {v.estado === "borrador" && <span className="text-blanco/60">Borrador</span>}
          </p>
          <h1 className="titular mt-5 max-w-5xl text-[clamp(2.1rem,4.6vw,5.25rem)]">{v.titulo}</h1>
          <span className="regla mt-7" />
          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-blanco/90">{v.resumen}</p>

          <div className="mt-10">
            <Markdown texto={v.cuerpo} />
          </div>

          {v.cifras.length > 0 && (
            <section aria-label="Las cifras" className="mt-14">
              <ol className={`grid overflow-hidden rounded-sm border-l border-t border-linea ${columnasCifras(v.cifras.length)}`}>
                {v.cifras.map((c, i) => (
                  <li key={i} className="border-b border-r border-linea p-6 transition-colors duration-300 hover:bg-carbon-2">
                    <p className="titular text-[clamp(1.8rem,3.2vw,2.6rem)]">{c.dato}</p>
                    <p className="mt-3 text-sm leading-relaxed text-blanco/85">{c.texto}</p>
                    <p className="mt-3 text-xs text-gris-2">
                      Fuente{c.fuentes.length > 1 && "s"}{" "}
                      {[...c.fuentes].sort((a, b) => (fuentesPorClave.get(a) ?? 0) - (fuentesPorClave.get(b) ?? 0)).map((k, j) => (
                        <a key={k} href={`#fuentes-${k}`} className="tabular-nums underline decoration-gris-2 underline-offset-4 hover:text-blanco">
                          {j > 0 && ", "}
                          {String(fuentesPorClave.get(k)).padStart(2, "0")}
                        </a>
                      ))}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {v.correcciones.length > 0 && (
            <section aria-labelledby="correcciones" className="mt-14 border-l-2 border-rojo pl-5">
              <h2 className="etiqueta mb-4" id="correcciones">Lo que corregimos</h2>
              <ul className="space-y-5 text-sm leading-relaxed">
                {v.correcciones.map((c, i) => (
                  <li key={i}>
                    <p className="text-gris-2">{fechaLarga(c.fecha)}</p>
                    <p className="mt-1"><span className="text-gris">Decíamos: </span>{c.error}</p>
                    <p><span className="text-gris">Lo correcto: </span>{c.correccion}</p>
                    {c.video && c.video !== v.id && <p className="mt-1"><Link href={`/videos/${c.video}`} className="underline decoration-gris-2 underline-offset-4">Ver el vídeo de corrección</Link></p>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-14 flex max-w-3xl flex-col gap-5 rounded-sm border border-linea p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="titular text-lg">Más historias así, en Instagram</p>
            <SeguirInstagram />
          </div>

          <section aria-labelledby="fuentes" className="mt-16">
            <h2 className="etiqueta mb-6" id="fuentes">Fuentes</h2>
            <ListaFuentes fuentes={v.fuentes} />
            <ul className="mt-6 space-y-1 text-xs leading-relaxed text-gris-2">
              {creditos.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
            <p className="mt-6 text-sm text-gris">
              ¿Algún dato está mal?{" "}
              <a href={mailto(`Corrección: ${v.titulo}`)} className="text-blanco underline decoration-gris-2 underline-offset-4 hover:decoration-rojo">Escríbenos</a>.
            </p>
          </section>
        </div>
      </div>

      {mas.length > 0 && (
        <section aria-labelledby="mas" className="mt-28">
          <div className="mb-8 flex items-end justify-between gap-6 border-t border-linea pt-8">
            <h2 id="mas" className="etiqueta">Más vídeos</h2>
            <Link href="/#videos" className="etiqueta enlace text-blanco/80">Ver todos</Link>
          </div>
          <Cuadricula videos={mas} />
        </section>
      )}
    </article>
  );
}
