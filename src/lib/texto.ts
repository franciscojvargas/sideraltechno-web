export function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function palabrasUnicas(texto: string): string {
  const palabras = normalizar(texto).split(/[^a-z0-9ñ]+/).filter((p) => p.length > 1);
  return [...new Set(palabras)].join(" ");
}

export function coincide(texto: string, consulta: string): boolean {
  return normalizar(consulta).split(/\s+/).filter(Boolean).every((p) => texto.includes(p));
}
