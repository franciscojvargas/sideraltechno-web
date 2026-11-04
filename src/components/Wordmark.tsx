import Link from "next/link";
import { idiomaActual } from "@/lib/idioma-actual";
import { ruta } from "@/lib/idiomas";
import { TEXTOS } from "@/lib/textos";

export async function Wordmark({ tamano = "md", enlace = true }: { tamano?: "sm" | "md" | "lg"; enlace?: boolean }) {
  const idioma = await idiomaActual();
  const clases = { sm: "text-[0.95rem]", md: "text-[1.15rem]", lg: "text-[clamp(2.4rem,9vw,6.5rem)]" }[tamano];
  const regla = { sm: "w-6 h-[2px] mt-1.5", md: "w-8 h-[2px] mt-2", lg: "w-[clamp(4rem,12vw,9rem)] h-[clamp(4px,0.8vw,8px)] mt-[clamp(0.8rem,2vw,1.5rem)]" }[tamano];
  const marca = (
    <span className="inline-block">
      <span className={`titular block leading-[0.92] ${clases}`} aria-hidden="true">
        Sideral
        <br />
        Techno
      </span>
      <span className="sr-only">Sideral Techno</span>
      <span className={`block bg-rojo ${regla}`} />
    </span>
  );
  return enlace ? (
    <Link href={ruta(idioma)} className="inline-block" aria-label={TEXTOS[idioma].inicio}>
      {marca}
    </Link>
  ) : (
    marca
  );
}
