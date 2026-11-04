import { describe, expect, it } from "vitest";
import { fechaLarga } from "../src/lib/fechas";
import { IDIOMAS, IDIOMA_ORIGINAL, alternativas, esIdioma, idiomaSeguro, ruta } from "../src/lib/idiomas";
import { TEXTOS, type Textos } from "../src/lib/textos";

describe("idiomas", () => {
  it("el original no lleva prefijo y los demás sí", () => {
    expect(ruta("es")).toBe("/");
    expect(ruta("es", "/videos/florida")).toBe("/videos/florida");
    expect(ruta("en")).toBe("/en");
    expect(ruta("en", "/videos/florida")).toBe("/en/videos/florida");
    expect(ruta("en", "videos/florida")).toBe("/en/videos/florida");
  });
  it("las alternativas cubren todos los idiomas y x-default apunta al original", () => {
    const a = alternativas("/videos/florida");
    for (const i of IDIOMAS) expect(a[i]).toBe(ruta(i, "/videos/florida"));
    expect(a["x-default"]).toBe(ruta(IDIOMA_ORIGINAL, "/videos/florida"));
  });
  it("solo acepta los idiomas de la web y nunca lanza", () => {
    expect(esIdioma("en")).toBe(true);
    expect(esIdioma("fr")).toBe(false);
    expect(esIdioma(undefined)).toBe(false);
    expect(idiomaSeguro("videos")).toBe(IDIOMA_ORIGINAL);
    expect(idiomaSeguro("en")).toBe("en");
  });
});

describe("textos", () => {
  const claves = (o: object, prefijo = ""): string[] =>
    Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" && !Array.isArray(v) ? claves(v, `${prefijo}${k}.`) : [`${prefijo}${k}`]));
  it.each(IDIOMAS)("%s tiene las mismas claves que el original", (i) => {
    expect(claves(TEXTOS[i])).toEqual(claves(TEXTOS[IDIOMA_ORIGINAL]));
  });
  it.each(IDIOMAS)("%s no deja textos vacíos ni exclamaciones", (i) => {
    const vacios = claves(TEXTOS[i]).filter((c) => {
      const v = c.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], TEXTOS[i]);
      return typeof v === "string" && v.trim() === "" && c !== "video.enEspanol";
    });
    expect(vacios).toEqual([]);
    expect(JSON.stringify(TEXTOS[i])).not.toMatch(/[!¡]/);
  });
  it("el aviso de contenido en español solo aparece fuera del español", () => {
    const t: Textos = TEXTOS[IDIOMA_ORIGINAL];
    expect(t.video.enEspanol).toBe("");
    for (const i of IDIOMAS.filter((x) => x !== IDIOMA_ORIGINAL)) expect(TEXTOS[i].video.enEspanol).not.toBe("");
  });
});

describe("fechas por idioma", () => {
  it("escribe la fecha en cada idioma", () => {
    expect(fechaLarga("2026-10-24")).toBe("24 de octubre de 2026");
    expect(fechaLarga("2026-10-24", "en")).toBe("24 October 2026");
    expect(fechaLarga("2026-10", "en")).toBe("October 2026");
    expect(fechaLarga("2026", "en")).toBe("2026");
    expect(fechaLarga(undefined, "en")).toBe("");
  });
});
