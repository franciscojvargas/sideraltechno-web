import Image from "next/image";
import Link from "next/link";
import { type Idioma, ruta } from "@/lib/idiomas";
import type { Video } from "@/lib/schema";

export type VideoTarjeta = Pick<Video, "id" | "serie" | "titulo" | "estado">;

// También se renderiza en el cliente (buscador): los textos llegan por props.
export function Cuadricula({ videos, idioma, borrador }: { videos: VideoTarjeta[]; idioma: Idioma; borrador: string }) {
  const rotulo = (v: VideoTarjeta) => [v.serie, v.estado === "borrador" && borrador].filter(Boolean).join(", ");
  return (
    <ul lang={idioma === "es" ? undefined : "es"} className="reja grid grid-cols-2 gap-x-2 gap-y-1 sm:grid-cols-3 sm:gap-1 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {videos.map((v) => (
        <li key={v.id} className="celda">
          <Link href={ruta(idioma, `/videos/${v.id}`)} className="group relative block overflow-hidden bg-carbon-2">
            <Image
              src={`/portadas/${v.id}.webp`}
              alt={v.titulo}
              width={720}
              height={1280}
              sizes="(min-width: 1536px) 17vw, (min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              quality={70}
              className="aspect-[9/16] h-auto w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.05]"
            />
            <span aria-hidden="true" className="velo absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-carbon via-carbon/70 via-30% to-transparent to-65% p-4 sm:p-5">
              <span className="etiqueta">{rotulo(v)}</span>
              <span className="titular mt-2 text-base leading-[1.08] sm:text-lg">{v.titulo}</span>
              <span className="regla mt-3 w-8" />
            </span>
            <span className="rotulo flex-col gap-1.5 bg-carbon px-0.5 pb-4 pt-3" aria-hidden="true">
              <span className="etiqueta">{rotulo(v)}</span>
              <span className="line-clamp-2 min-h-[2.5em] text-[0.8125rem] font-bold uppercase leading-[1.25]">{v.titulo}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
