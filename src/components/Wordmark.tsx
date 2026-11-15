import Link from "next/link";
import { idiomaActual } from "@/lib/idioma-actual";
import { ruta } from "@/lib/idiomas";
import { TEXTOS } from "@/lib/textos";

export async function Wordmark() {
  const idioma = await idiomaActual();
  return (
    <Link href={ruta(idioma)} className="inline-block" aria-label={TEXTOS[idioma].inicio}>
      <span className="inline-block">
        <span className="titular block text-[0.95rem] leading-[0.92]" aria-hidden="true">
          Sideral
          <br />
          Techno
        </span>
        <span className="sr-only">Sideral Techno</span>
        <span className="mt-1.5 block h-[2px] w-6 bg-rojo" />
      </span>
    </Link>
  );
}
