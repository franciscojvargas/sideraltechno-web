export const SITIO = {
  nombre: "Sideral Techno",
  lema: "Cultura techno en vídeos cortos",
  descripcion:
    "Vídeos cortos sobre cultura techno: discotecas míticas, festivales, la Ruta del Bakalao y el sonido en la pista. Cada dato, con su fuente.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sideraltechno.com").replace(/\/$/, ""),
  instagram: "https://www.instagram.com/sideral_techno/",
  usuarioInstagram: "@sideral_techno",
  tiktok: "https://www.tiktok.com/@sideraltechno",
  correo: process.env.NEXT_PUBLIC_CORREO ?? "admin@sideraltechno.com",
  idioma: "es-ES",
} as const;

export const MOSTRAR_BORRADORES = process.env.MOSTRAR_BORRADORES === "1" || process.env.NODE_ENV !== "production";

export function jsonLd(datos: unknown): string {
  return JSON.stringify(datos).replace(/</g, "\\u003c");
}

export function mailto(asunto?: string): string {
  return `mailto:${SITIO.correo}${asunto ? `?subject=${encodeURIComponent(asunto)}` : ""}`;
}
