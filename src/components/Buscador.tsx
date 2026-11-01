"use client";

import { useDeferredValue, useEffect, useRef, useState } from "react";
import { coincide } from "@/lib/texto";
import { Cuadricula, type VideoTarjeta } from "./Cuadricula";

export type VideoBuscable = VideoTarjeta & { texto: string };

export function Buscador({ videos, correo }: { videos: VideoBuscable[]; correo: string }) {
  const [consulta, setConsulta] = useState("");
  const diferida = useDeferredValue(consulta);
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const atajo = (e: KeyboardEvent) => {
      const destino = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(destino.tagName)) {
        e.preventDefault();
        campo.current?.focus();
      }
    };
    window.addEventListener("keydown", atajo);
    return () => window.removeEventListener("keydown", atajo);
  }, []);

  const buscando = diferida.trim().length > 0;
  const resultado = buscando ? videos.filter((v) => coincide(v.texto, diferida)) : videos;

  return (
    <>
      <div className="mb-8 flex flex-col gap-6 border-t border-linea pt-8 md:flex-row md:items-end md:justify-between">
        <h2 id="titulo-videos" className="etiqueta">Todos los vídeos</h2>
        <div role="search" className="buscador flex w-full items-center gap-3 border-b border-linea pb-2 md:max-w-md">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 text-gris" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <label htmlFor="buscar" className="sr-only">Buscar vídeos</label>
          <input
            ref={campo}
            id="buscar"
            type="search"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value.slice(0, 80))}
            placeholder="Busca un club, un festival o un tema"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            className="w-full bg-transparent text-base text-blanco placeholder:text-gris-2 focus:outline-none"
          />
          <span className="etiqueta shrink-0 tabular-nums" aria-live="polite">
            {resultado.length}
            <span className="sr-only"> {resultado.length === 1 ? "vídeo" : "vídeos"}</span>
          </span>
        </div>
      </div>

      {resultado.length > 0 ? (
        <Cuadricula videos={resultado} />
      ) : (
        <div className="border-y border-linea py-16 text-center">
          <p className="titular text-2xl">Nada con esas palabras</p>
          <p className="mt-4 text-gris">
            ¿Echas en falta un tema?{" "}
            <a href={`mailto:${correo}?subject=${encodeURIComponent(`Propuesta de tema: ${consulta.trim()}`)}`} className="text-blanco underline decoration-gris-2 underline-offset-4 hover:decoration-rojo">Escríbenos</a>.
          </p>
        </div>
      )}
    </>
  );
}
