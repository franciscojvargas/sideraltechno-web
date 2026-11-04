// El español es el original y no lleva prefijo en la URL; los demás idiomas van bajo /<idioma>/.
export const IDIOMAS = ["es", "en"] as const;
export type Idioma = (typeof IDIOMAS)[number];
export const IDIOMA_ORIGINAL: Idioma = "es";

export function esIdioma(valor: unknown): valor is Idioma {
  return typeof valor === "string" && (IDIOMAS as readonly string[]).includes(valor);
}

export function idiomaSeguro(valor: unknown): Idioma {
  return esIdioma(valor) ? valor : IDIOMA_ORIGINAL;
}

/** ruta("en", "/videos/florida") → "/en/videos/florida" */
export function ruta(idioma: Idioma, camino = "/"): string {
  const limpio = camino.startsWith("/") ? camino : `/${camino}`;
  if (idioma === IDIOMA_ORIGINAL) return limpio;
  return limpio === "/" ? `/${idioma}` : `/${idioma}${limpio}`;
}

/** Versiones de un camino en todos los idiomas, para hreflang. */
export function alternativas(camino = "/"): Record<Idioma | "x-default", string> {
  const todas = Object.fromEntries(IDIOMAS.map((i) => [i, ruta(i, camino)])) as Record<Idioma, string>;
  return { ...todas, "x-default": ruta(IDIOMA_ORIGINAL, camino) };
}

export const LOCALE_OG: Record<Idioma, string> = { es: "es_ES", en: "en_GB" };

export const NOMBRE_IDIOMA: Record<Idioma, string> = { es: "Español", en: "English" };
