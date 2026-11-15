import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { type Idioma, IDIOMA_ORIGINAL } from "./idiomas.ts";
import { VideoFrontmatterSchema, type Video, type VideoFrontmatter } from "./schema.ts";

const RAIZ = path.join(process.cwd(), "content", "videos");

class ErrorContenido extends Error {
  fichero: string;
  constructor(fichero: string, mensaje: string) {
    super(`${fichero}: ${mensaje}`);
    this.fichero = fichero;
  }
}

function aTextoPlano(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function leerFichero(fichero: string): Video {
  const ruta = path.join(RAIZ, fichero);
  const bruto = fs.readFileSync(ruta, "utf8");
  const { data, content } = matter(bruto);
  const res = VideoFrontmatterSchema.safeParse(data);
  if (!res.success) {
    const detalle = res.error.issues.map((i) => `  - ${i.path.join(".") || "(raíz)"}: ${i.message}`).join("\n");
    throw new ErrorContenido(fichero, `metadatos no válidos\n${detalle}`);
  }
  const fm = res.data;
  if (fm.id !== fichero.replace(/\.md$/, "")) {
    throw new ErrorContenido(fichero, `el id «${fm.id}» no coincide con el nombre del fichero`);
  }
  const claves = new Set(fm.fuentes.map((f) => f.clave));
  if (claves.size !== fm.fuentes.length) throw new ErrorContenido(fichero, "hay claves de fuente repetidas");
  for (const c of fm.cifras) {
    for (const k of c.fuentes) {
      if (!claves.has(k)) throw new ErrorContenido(fichero, `la cifra «${c.dato}» cita una fuente que no existe: ${k}`);
    }
  }
  if (fm.estado === "publicado" && !fm.publicado) throw new ErrorContenido(fichero, "un vídeo publicado necesita fecha «publicado»");
  const cuerpo = content.trim();
  if (cuerpo.length < 200) throw new ErrorContenido(fichero, "el texto es demasiado corto (< 200 caracteres)");
  if (fm.estado === "publicado" && !fm.en) throw new ErrorContenido(fichero, "un vídeo publicado necesita su versión en inglés (bloque «en»)");
  if (fm.en) comprobarTraduccion(fichero, fm, cuerpo);
  return { ...fm, cuerpo, cuerpoPlano: aTextoPlano(cuerpo) };
}

// La traducción va pieza a pieza con el original: nada sin traducir y nada de más.
function comprobarTraduccion(fichero: string, fm: VideoFrontmatter, cuerpo: string) {
  const en = fm.en!;
  const distinto = (que: string, a: number, b: number) => {
    if (a !== b) throw new ErrorContenido(fichero, `en inglés hay ${b} ${que} y en español ${a}`);
  };
  distinto("cifras", fm.cifras.length, en.cifras.length);
  distinto("correcciones", fm.correcciones.length, en.correcciones.length);
  distinto("créditos de imágenes", fm.creditos.imagenes?.length ?? 0, en.creditos.imagenes?.length ?? 0);
  distinto("créditos «otros»", fm.creditos.otros?.length ?? 0, en.creditos.otros?.length ?? 0);
  for (const campo of ["serie", "musica", "mapa"] as const) {
    const es = campo === "serie" ? fm.serie : fm.creditos[campo];
    const tr = campo === "serie" ? en.serie : en.creditos[campo];
    if (!es !== !tr) throw new ErrorContenido(fichero, `«${campo}» tiene que estar en los dos idiomas o en ninguno`);
  }
  const enlaces = (md: string) => [...md.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]).sort();
  if (enlaces(en.cuerpo).join() !== enlaces(cuerpo).join()) {
    throw new ErrorContenido(fichero, "el texto en inglés no enlaza a las mismas direcciones que el español");
  }
}

let cache: Video[] | null = null;

export function todosLosVideos(): Video[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const ficheros = fs
    .readdirSync(RAIZ)
    .filter((f) => f.endsWith(".md"))
    .sort();
  const videos = ficheros.map(leerFichero);
  const ids = new Set(videos.map((v) => v.id));
  for (const v of videos) {
    v.relacionadosPendientes = v.relacionados.filter((r) => !ids.has(r));
    v.relacionados = v.relacionados.filter((r) => ids.has(r));
    for (const c of v.correcciones) {
      if (c.video && !ids.has(c.video)) throw new ErrorContenido(`${v.id}.md`, `corrección que apunta a un vídeo que no existe: ${c.video}`);
    }
  }
  // Lo último publicado, primero; los borradores (sin fecha) encima. El mismo día, por número de producción.
  videos.sort((a, b) => (b.publicado ?? "9999").localeCompare(a.publicado ?? "9999") || b.numero.localeCompare(a.numero));
  cache = videos;
  return videos;
}

export function videosPublicados(): Video[] {
  return todosLosVideos().filter((v) => v.estado === "publicado");
}

export function videoPorId(id: string): Video | undefined {
  return todosLosVideos().find((v) => v.id === id);
}

export function urlInstagram(v: Video): string | undefined {
  return v.instagram ? `https://www.instagram.com/sideral_techno/reel/${v.instagram}/` : undefined;
}
export function urlTiktok(v: Video): string | undefined {
  return v.tiktok ? `https://www.tiktok.com/@sideraltechno/video/${v.tiktok}` : undefined;
}

/** Lo que necesita una tarjeta de la cuadrícula; lang solo si la ficha no está en el idioma de la página. */
export function tarjeta(v: Video, idioma: Idioma) {
  const t = enIdioma(v, idioma);
  return { id: t.id, serie: t.serie, titulo: t.titulo, estado: t.estado, lang: t.idiomaFicha === idioma ? undefined : t.idiomaFicha };
}

/** La ficha tal como se lee en un idioma. Sin traducción (solo en borradores) queda el original, marcado con su idioma. */
export function enIdioma(v: Video, idioma: Idioma): Video & { idiomaFicha: Idioma } {
  const en = idioma === "en" ? v.en : undefined;
  if (!en) return { ...v, idiomaFicha: IDIOMA_ORIGINAL };
  return {
    ...v,
    idiomaFicha: idioma,
    titulo: en.titulo,
    serie: en.serie,
    resumen: en.resumen,
    cuerpo: en.cuerpo,
    cuerpoPlano: aTextoPlano(en.cuerpo),
    cifras: v.cifras.map((c, i) => ({ ...c, ...en.cifras[i] })),
    correcciones: v.correcciones.map((c, i) => ({ ...c, ...en.correcciones[i] })),
    creditos: en.creditos,
  };
}
