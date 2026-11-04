import { idiomaActual } from "@/lib/idioma-actual";
import { TEXTOS } from "@/lib/textos";
import { Redes } from "./Redes";
import { SelectorIdioma } from "./SelectorIdioma";
import { Wordmark } from "./Wordmark";

export async function Cabecera() {
  const idioma = await idiomaActual();
  return (
    <header className="cabecera marco flex items-center justify-between gap-4 pb-3 sm:gap-6 sm:pb-5 sm:pt-5">
      <Wordmark tamano="sm" />
      <div className="flex items-center gap-3 sm:gap-5">
        <SelectorIdioma idioma={idioma} etiqueta={TEXTOS[idioma].idioma} />
        <Redes />
      </div>
    </header>
  );
}
