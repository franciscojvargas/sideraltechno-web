import { lang } from "next/root-params";
import { type Idioma, esIdioma, idiomaSeguro } from "./idiomas";

// Solo en componentes de servidor: next/root-params no está en route handlers ni en el cliente.

/** Idioma del segmento [lang]; si no es de la web, el original. No lanza, para que la 404 se renderice dentro del layout. */
export async function idiomaActual(): Promise<Idioma> {
  return idiomaSeguro(await lang());
}

export async function idiomaDesconocido(): Promise<boolean> {
  return !esIdioma(await lang());
}
