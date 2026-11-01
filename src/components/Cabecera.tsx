import { mailto } from "@/lib/sitio";
import { Redes } from "./Redes";
import { Wordmark } from "./Wordmark";

export function Cabecera() {
  return (
    <header className="marco flex items-center justify-between gap-6 py-5 sm:py-7">
      <Wordmark tamano="sm" />
      <div className="flex items-center gap-4 sm:gap-6">
        <a href={mailto()} className="etiqueta enlace hidden text-blanco/80 sm:inline">
          Escríbenos
        </a>
        <Redes />
      </div>
    </header>
  );
}
