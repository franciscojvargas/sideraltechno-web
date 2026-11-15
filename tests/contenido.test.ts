import { describe, expect, it } from "vitest";
import { todosLosVideos } from "../src/lib/content";

describe("contenido", () => {
  const videos = todosLosVideos();
  it("hay vídeos y los ids son únicos", () => {
    expect(videos.length).toBeGreaterThan(0);
    expect(new Set(videos.map((v) => v.id)).size).toBe(videos.length);
  });
  it("los números son únicos", () => {
    expect(new Set(videos.map((v) => v.numero)).size).toBe(videos.length);
  });
  it("se ordenan por fecha de publicación, lo último primero", () => {
    const fechas = videos.filter((v) => v.publicado).map((v) => v.publicado!);
    expect(fechas).toEqual([...fechas].sort().reverse());
  });
  it.each(videos.map((v) => [v.id, v] as const))("%s: cada cifra tiene fuente y los borradores no enlazan al reel", (_id, v) => {
    for (const c of v.cifras) expect(c.fuentes.length).toBeGreaterThan(0);
    if (v.estado === "borrador") expect(v.instagram ?? v.tiktok).toBeUndefined();
  });
  it.each(videos.map((v) => [v.id, v] as const))("%s: el texto público no lleva notas internas", (_id, v) => {
    const todo = JSON.stringify(v);
    expect(todo).not.toMatch(/visualizaciones|seguidores ganados|permiso pendiente|\b[\w-]+\/[\w.-]+\.(tsx?|mjs|py|json)\b|npm run/i);
  });
  it.each(videos.filter((v) => v.estado === "publicado").map((v) => [v.id, v] as const))("%s: la versión en inglés sigue las reglas de la marca", (_id, v) => {
    expect(v.en).toBeDefined();
    // Los títulos de obras se citan tal cual, aunque lleven exclamación.
    const todo = JSON.stringify(v.en).replace(/Techno! The New Dance Sound of Detroit|Kr!z/g, "");
    expect(todo).not.toMatch(/[!¡«»]/);
    expect(v.en!.resumen.length).toBeLessThanOrEqual(160);
  });
  it("una serie se traduce siempre igual", () => {
    const series = new Map<string, Set<string>>();
    for (const v of videos) if (v.serie && v.en?.serie) series.set(v.serie, (series.get(v.serie) ?? new Set()).add(v.en.serie));
    expect([...series].filter(([, en]) => en.size > 1).map(([es, en]) => `${es} → ${[...en].join(" | ")}`)).toEqual([]);
  });
});
