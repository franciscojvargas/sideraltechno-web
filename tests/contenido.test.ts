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
  it.each(videos.map((v) => [v.id, v] as const))("%s: cada cifra tiene fuente y cada publicado su enlace", (_id, v) => {
    for (const c of v.cifras) expect(c.fuentes.length).toBeGreaterThan(0);
    if (v.estado === "publicado") expect(v.instagram ?? v.tiktok).toBeTruthy();
    if (v.estado === "borrador") expect(v.instagram).toBeUndefined();
  });
  it.each(videos.map((v) => [v.id, v] as const))("%s: el texto público no lleva notas internas", (_id, v) => {
    const todo = JSON.stringify(v);
    expect(todo).not.toMatch(/\bla titular\b|visualizaciones|carpeta de temas|permiso pendiente|(^|[\s(`])(publicaciones|docs|guiones|out)\/|\.tsx\b|npm run/i);
  });
});
