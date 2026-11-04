"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { IDIOMAS, NOMBRE_IDIOMA, type Idioma, ruta } from "@/lib/idiomas";

// Usa los segmentos de la ruta y no la URL del navegador: /videos/x se sirve reescrito desde /es/videos/x
// y así el HTML prerenderizado coincide con el hidratado. Enlaces normales, sin prefetch: el <html lang> cambia.
export function SelectorIdioma({ idioma, etiqueta }: { idioma: Idioma; etiqueta: string }) {
  const segmentos = useSelectedLayoutSegments();
  const camino =
    "/" +
    segmentos
      .filter((s) => !/^[(_/]/.test(s))
      .flatMap((s) => s.split("/"))
      .filter(Boolean)
      .map(encodeURIComponent)
      .join("/");

  return (
    <nav aria-label={etiqueta}>
      <ul className="idiomas">
        {IDIOMAS.map((i) => (
          <li key={i}>
            <a href={ruta(i, camino)} hrefLang={i} lang={i} aria-label={NOMBRE_IDIOMA[i]} aria-current={i === idioma ? "page" : undefined} title={NOMBRE_IDIOMA[i]}>
              {i.toUpperCase()}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
