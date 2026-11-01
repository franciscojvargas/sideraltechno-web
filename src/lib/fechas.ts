const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export function fechaLarga(f?: string): string {
  if (!f) return "";
  const [a, m, d] = f.split("-").map(Number);
  if (d) return `${d} de ${MESES[m - 1]} de ${a}`;
  if (m) return `${MESES[m - 1]} de ${a}`;
  return String(a);
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
