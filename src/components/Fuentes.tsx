import type { Fuente } from "@/lib/schema";
import { fechaLarga } from "@/lib/fechas";
import type { Idioma } from "@/lib/idiomas";

export function dominio(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

export function ListaFuentes({ fuentes, id = "fuentes", idioma = "es" }: { fuentes: Fuente[]; id?: string; idioma?: Idioma }) {
  return (
    <ol className="grid border-b border-linea xl:grid-cols-2 xl:gap-x-12">
      {fuentes.map((f, i) => (
        <li key={f.clave} id={`${id}-${f.clave}`} className="grid scroll-mt-24 grid-cols-[2.25rem_1fr] gap-3 border-t border-linea py-4 text-sm leading-relaxed">
          <span className="tabular-nums text-gris-2">{String(i + 1).padStart(2, "0")}</span>
          <div className="min-w-0">
            <p className="flex flex-wrap gap-x-3">
              <span className="font-bold">{f.medio}</span>
              {f.fecha && <span className="text-gris" lang={idioma}>{fechaLarga(f.fecha, idioma)}</span>}
            </p>
            {f.titulo && <p className="mt-0.5 text-gris">{f.titulo}</p>}
            {f.url && (
              <a href={f.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block break-all text-blanco/80 underline decoration-gris-2 underline-offset-4 hover:decoration-rojo">
                {dominio(f.url)}
              </a>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
