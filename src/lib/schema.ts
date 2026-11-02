import { z } from "zod";

export const TIPOS_FUENTE = ["oficial", "prensa", "academico", "libro", "web", "enciclopedia", "mapa", "archivo", "comentarios", "entrevista"] as const;

export const TIPOS_VIDEO = ["club", "festival", "escena", "cultura", "dj", "artista", "correccion", "homenaje"] as const;

// YAML convierte «2019» en número y «2019-10-24» en fecha: se normaliza todo a texto.
const fecha = z
  .union([z.string(), z.date(), z.number().int()])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v)))
  .pipe(z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, "fecha AAAA, AAAA-MM o AAAA-MM-DD"));

// Solo enlaces web: nada de javascript:, data: ni similares.
const enlace = z.url({ protocol: /^https?$/, message: "URL http(s) completa" });

export const FuenteSchema = z.object({
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

export const CifraSchema = z.object({
  dato: z.string().min(1),
  texto: z.string().min(1),
  fuentes: z.array(z.string()).min(1),
  matiz: z.string().optional(),
});

export const LineaGuionSchema = z.object({
  clave: z.string(),
  texto: z.string(),
});

export const CorreccionSchema = z.object({
  fecha: fecha,
  error: z.string().min(1),
  correccion: z.string().min(1),
  video: z.string().optional(),
  origen: z.string().optional(),
});

export const LugarSchema = z.object({
  nombre: z.string().min(1),
  municipio: z.string().optional(),
  provincia: z.string().optional(),
  pais: z.string().optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  aproximado: z.boolean().optional(),
});

export const CreditosSchema = z.object({
  imagenes: z.array(z.string()).optional(),
  musica: z.string().optional(),
  mapa: z.string().optional(),
  voz: z.string().default("Voz generada con IA (ElevenLabs), etiquetada como tal en Instagram y TikTok."),
  otros: z.array(z.string()).optional(),
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
  video: enlace.optional(),
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
});

export type VideoFrontmatter = z.infer<typeof VideoFrontmatterSchema>;
export type Fuente = z.infer<typeof FuenteSchema>;
export type Cifra = z.infer<typeof CifraSchema>;
export type Correccion = z.infer<typeof CorreccionSchema>;

export type Video = VideoFrontmatter & {
  cuerpo: string;
  cuerpoPlano: string;
  slug: string;
  relacionadosPendientes?: string[];
};
