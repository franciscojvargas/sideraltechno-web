import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/lib/schema";

export type VideoTarjeta = Pick<Video, "id" | "numero" | "titulo" | "estado">;

export function Cuadricula({ videos }: { videos: VideoTarjeta[] }) {
  return (
    <ul className="reja grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {videos.map((v) => (
        <li key={v.id} className="celda">
          <Link href={`/videos/${v.id}`} className="group relative block overflow-hidden bg-carbon-2">
            <Image
              src={`/portadas/${v.id}.webp`}
              alt={v.titulo}
              width={720}
              height={1280}
              sizes="(min-width: 1536px) 17vw, (min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              quality={70}
              className="aspect-[9/16] h-auto w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.05]"
            />
            <span className="velo absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-carbon via-carbon/70 via-30% to-transparent to-65% p-4 sm:p-5">
              <span className="etiqueta tabular-nums">{v.numero}{v.estado === "borrador" && ", borrador"}</span>
              <span className="titular mt-2 text-base leading-[1.08] sm:text-lg">{v.titulo}</span>
              <span className="regla mt-3 w-8" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
