import { describe, expect, it } from "vitest";
import { coincide, normalizar } from "../src/lib/texto";

describe("buscador", () => {
  const texto = normalizar("Masía, en Segorbe (Castellón): la Ruta del Bakalao");
  it("no distingue tildes ni mayúsculas", () => {
    expect(coincide(texto, "MASIA castellon")).toBe(true);
  });
  it("exige todas las palabras", () => {
    expect(coincide(texto, "masia ibiza")).toBe(false);
  });
  it("una consulta vacía coincide con todo", () => {
    expect(coincide(texto, "   ")).toBe(true);
  });
});
