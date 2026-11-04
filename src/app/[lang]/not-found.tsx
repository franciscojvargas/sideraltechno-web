import Link from "next/link";
import { idiomaActual } from "@/lib/idioma-actual";
import { ruta } from "@/lib/idiomas";
import { TEXTOS } from "@/lib/textos";

export default async function NoEncontrado() {
  const idioma = await idiomaActual();
  const t = TEXTOS[idioma].noEncontrado;
  return (
    <section className="marco py-32">
      <p className="etiqueta mb-4">404</p>
      <h1 className="titular text-[clamp(2.4rem,7vw,5rem)]">{t.titulo}</h1>
      <span className="regla mt-6" />
      <p className="mt-8 max-w-prose text-lg text-gris">{t.texto}</p>
      <Link href={ruta(idioma)} className="boton mt-10">{t.volver}</Link>
    </section>
  );
}
