import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { VideoFrontmatterSchema, type Video } from "./schema.ts";

const RAIZ = path.join(process.cwd(), "content", "videos");

export class ErrorContenido extends Error {
  fichero: string;
  constructor(fichero: string, mensaje: string) {
    super(`${fichero}: ${mensaje}`);
    this.fichero = fichero;
  }
}

export function aTextoPlano(md: string): string {
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
  return { ...fm, cuerpo, cuerpoPlano: aTextoPlano(cuerpo), slug: fm.id };
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
  videos.sort((a, b) => b.numero.localeCompare(a.numero));
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
