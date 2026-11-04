import type { Idioma } from "./idiomas";

const MESES: Record<Idioma, string[]> = {
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

const FORMATO: Record<Idioma, (a: number, mes: string, d?: number) => string> = {
  es: (a, mes, d) => (d ? `${d} de ${mes} de ${a}` : `${mes} de ${a}`),
  en: (a, mes, d) => (d ? `${d} ${mes} ${a}` : `${mes} ${a}`),
};

export function fechaLarga(f?: string, idioma: Idioma = "es"): string {
  if (!f) return "";
  const [a, m, d] = f.split("-").map(Number);
  if (!m) return String(a);
  return FORMATO[idioma](a, MESES[idioma][m - 1], d);
}

export function fechaCorta(f?: string): string {
  if (!f) return "";
  const [a, m, d] = f.split("-").map(Number);
  if (d) return `${d}-${String(m).padStart(2, "0")}-${a}`;
  if (m) return `${String(m).padStart(2, "0")}-${a}`;
  return String(a);
}

export function fechaISO(f?: string): string | undefined {
  if (!f) return undefined;
  const partes = f.split("-");
  while (partes.length < 3) partes.push("01");
  return partes.join("-");
}

export function duracionLegible(s?: number): string {
  if (!s) return "";
  const m = Math.floor(s / 60);
  const r = Math.round(s % 60);
  return m ? `${m} min ${r} s` : `${r} s`;
}
