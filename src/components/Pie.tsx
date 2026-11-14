import { idiomaActual } from "@/lib/idioma-actual";
import { SITIO, mailto } from "@/lib/sitio";
import { TEXTOS } from "@/lib/textos";
import { IconoInstagram, Redes } from "./Redes";

export async function Pie() {
  const textos = TEXTOS[await idiomaActual()];
  const t = textos.pie;
  return (
    <footer className="mt-20 sm:mt-32">
      <section className="marco border-t border-linea py-14 sm:py-28">
        <p className="etiqueta">{t.lema}</p>
        <a href={SITIO.instagram} target="_blank" rel="me noopener noreferrer" className="group mt-6 inline-flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="titular break-all text-[clamp(2.2rem,8vw,7.5rem)] transition-colors duration-300 [-webkit-text-stroke:1px_var(--blanco)] group-hover:text-transparent">{SITIO.usuarioInstagram}</span>
          <span className="inline-flex h-[clamp(3rem,6vw,5.5rem)] w-[clamp(3rem,6vw,5.5rem)] shrink-0 items-center justify-center rounded-full bg-rojo text-carbon transition-transform duration-300 group-hover:rotate-12">
            <IconoInstagram className="h-1/2 w-1/2" />
          </span>
        </a>
        <p className="mt-6 max-w-xl text-lg text-gris">
          {t.sigue}{" "}
          <a href={SITIO.tiktok} target="_blank" rel="me noopener noreferrer" className="text-blanco underline decoration-gris-2 underline-offset-4 transition-colors hover:decoration-rojo">TikTok</a>.
        </p>
      </section>

      <div className="marco flex flex-col gap-6 border-t border-linea py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Redes className="-ml-2.5" />
          <p className="text-sm text-gris">
            {t.pregunta}{" "}
            <a href={mailto()} className="text-blanco underline decoration-gris-2 underline-offset-4 transition-colors hover:decoration-rojo">{textos.escribenos}</a>
          </p>
        </div>
        <p className="text-xs leading-relaxed text-gris-2 sm:text-right">
          {t.legal}
          <br className="hidden sm:inline" /> {t.salud}
        </p>
      </div>
    </footer>
  );
}
