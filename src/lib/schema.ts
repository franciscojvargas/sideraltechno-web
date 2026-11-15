import { z } from "zod";

const TIPOS_FUENTE = ["oficial", "prensa", "academico", "libro", "web", "enciclopedia", "mapa", "archivo", "comentarios", "entrevista"] as const;

const TIPOS_VIDEO = ["club", "festival", "escena", "cultura", "dj", "artista", "correccion", "homenaje"] as const;

// YAML convierte «2019» en número y «2019-10-24» en fecha: se normaliza todo a texto.
const fecha = z
  .union([z.string(), z.date(), z.number().int()])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v)))
  .pipe(z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, "fecha AAAA, AAAA-MM o AAAA-MM-DD"));

// Solo enlaces web: nada de javascript:, data: ni similares.
const enlace = z.url({ protocol: /^https?$/, message: "URL http(s) completa" });

const FuenteSchema = z.object({
  clave: z.string().regex(/^[a-z0-9-]+$/, "clave en minúsculas con guiones"),
  medio: z.string().min(1),
  titulo: z.string().optional(),
  autor: z.string().optional(),
  fecha: fecha.optional(),
  url: enlace.optional(),
  tipo: z.enum(TIPOS_FUENTE),
  sostiene: z.string().optional(),
  cita: z.string().optional(),
  consultada: fecha.optional(),
});

const CifraSchema = z.object({
  dato: z.string().min(1),
  texto: z.string().min(1),
  fuentes: z.array(z.string()).min(1),
  matiz: z.string().optional(),
});

const LineaGuionSchema = z.object({
  clave: z.string(),
  texto: z.string(),
});

const CorreccionSchema = z.object({
  fecha: fecha,
  error: z.string().min(1),
  correccion: z.string().min(1),
  video: z.string().optional(),
  origen: z.string().optional(),
});

const LugarSchema = z.object({
  nombre: z.string().min(1),
  municipio: z.string().optional(),
  provincia: z.string().optional(),
  pais: z.string().optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  aproximado: z.boolean().optional(),
});

const CreditosSchema = z.object({
  imagenes: z.array(z.string()).optional(),
  musica: z.string().optional(),
  mapa: z.string().optional(),
  voz: z.string().default("Voz generada con IA (ElevenLabs), etiquetada como tal en Instagram y TikTok."),
  otros: z.array(z.string()).optional(),
});

// La ficha en inglés: lo que se lee en la página, en el mismo orden que el original.
// Las fuentes, los lugares y los enlaces son los del original y no se repiten.
const TraduccionSchema = z.object({
  titulo: z.string().min(1),
  serie: z.string().optional(),
  resumen: z.string().min(20).max(220),
  cifras: z.array(z.object({ dato: z.string().min(1), texto: z.string().min(1) })).default([]),
  correcciones: z.array(z.object({ error: z.string().min(1), correccion: z.string().min(1) })).default([]),
  creditos: z
    .object({
      imagenes: z.array(z.string()).optional(),
      musica: z.string().optional(),
      mapa: z.string().optional(),
      voz: z.string().default("AI-generated voice (ElevenLabs), labelled as such on Instagram and TikTok."),
      otros: z.array(z.string()).optional(),
    })
    .prefault({}),
  cuerpo: z.string().trim().min(200, "el texto en inglés es demasiado corto (< 200 caracteres)"),
});

export const VideoFrontmatterSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+$/),
  numero: z.string().regex(/^\d{3}$/),
  titulo: z.string().min(1),
  gancho: z.string().optional(),
  serie: z.string().optional(),
  tipo: z.enum(TIPOS_VIDEO).optional(),
  resumen: z.string().min(20).max(220),
  estado: z.enum(["publicado", "borrador"]),
  formato: z.enum(["estandar", "ampliado", "largo"]).default("estandar"),
  duracion: z.number().positive().optional(),
  publicado: fecha.optional(),
  actualizado: fecha.optional(),
  /** Código del reel: instagram.com/sideral_techno/reel/<instagram> */
  instagram: z.string().regex(/^[A-Za-z0-9_-]+$/, "solo el código del reel").optional(),
  /** tiktok.com/@sideraltechno/video/<tiktok> */
  tiktok: z.string().regex(/^\d+$/, "solo el número del vídeo").optional(),
  lugar: LugarSchema.optional(),
  etiquetas: z.array(z.union([z.string(), z.number()]).transform(String)).default([]),
  guion: z.array(LineaGuionSchema).default([]),
  cifras: z.array(CifraSchema).default([]),
  fuentes: z.array(FuenteSchema).min(1),
  creditos: CreditosSchema.prefault({}),
  correcciones: z.array(CorreccionSchema).default([]),
  noDicho: z.array(z.string()).default([]),
  preguntasAbiertas: z.array(z.string()).default([]),
  relacionados: z.array(z.string()).default([]),
  cuentas: z.array(z.object({ red: z.enum(["instagram", "tiktok", "web"]), usuario: z.string(), nombre: z.string().optional() })).default([]),
  en: TraduccionSchema.optional(),
});

export type VideoFrontmatter = z.infer<typeof VideoFrontmatterSchema>;
export type Fuente = z.infer<typeof FuenteSchema>;

export type Video = VideoFrontmatter & {
  cuerpo: string;
  cuerpoPlano: string;
  relacionadosPendientes?: string[];
};
