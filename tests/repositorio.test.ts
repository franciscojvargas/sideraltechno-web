import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const ficheros = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" }).split("\n").filter(Boolean);

const PROHIBIDOS = [
  /(^|\/)\.env(?!\.example$)/,
  /\.(pem|key|p12|pfx|crt|cer|der|jks|keystore|gpg)$/,
  /(^|\/)id_(rsa|ed25519)/,
  /(credentials|service-account).*\.json$/,
  /(^|\/)(CLAUDE|AGENTS)(\.local)?\.md$/,
  /(^|\/)\.(claude|cursor|codex|vercel)\//,
  /(^|\/)(borradores|guiones|notas|privado)\//,
];

const SECRETOS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bgh[pousr]_[A-Za-z0-9]{36,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{40,}\b/,
  /\bsk-(ant-|proj-)?[A-Za-z0-9_-]{20,}\b/,
  /\bre_[A-Za-z0-9]{8}_[A-Za-z0-9]{16,}\b/,
  /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/,
  /\bAIza[0-9A-Za-z_-]{35}\b/,
  /\b(api[_-]?key|secret|token|password|contraseña)\s*[:=]\s*["'][^"'\s]{12,}["']/i,
];

const BINARIO = /\.(webp|jpe?g|png|gif|ico|woff2?|ttf|otf)$/i;

describe("lo que se sube al repositorio", () => {
  it("no hay ficheros privados ni de herramientas", () => {
    expect(ficheros.filter((f) => PROHIBIDOS.some((p) => p.test(f)))).toEqual([]);
  });

  it("ningún fichero contiene claves ni tokens", () => {
    const conSecretos = ficheros
      .filter((f) => !BINARIO.test(f) && f !== "package-lock.json")
      .filter((f) => {
        try {
          const texto = readFileSync(f, "utf8");
          return SECRETOS.some((p) => p.test(texto));
        } catch {
          return false;
        }
      });
    expect(conSecretos).toEqual([]);
  });
});
