// Pasa a la web un vídeo recién subido a Instagram y TikTok.
// Uso: npm run publicar -- <id> --instagram <enlace|código> [--tiktok <enlace|número>] [--fecha AAAA-MM-DD]
//                          [--portada <png>] [--borradores <carpeta>]
//  1. Trae la ficha de <borradores>/videos/<id>.md si aún no está en content/videos/.
//  2. Pone estado, publicado, actualizado, instagram y tiktok.
//  3. Deja las portadas en public/portadas/ (las del borrador o generadas desde el PNG).
//  4. Valida todo el contenido y, si pasa, quita el borrador de la carpeta privada.
// La carpeta de borradores por defecto es ../sideraltechno/web-borradores (o la variable BORRADORES).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    instagram: { type: "string" },
    tiktok: { type: "string" },
    fecha: { type: "string" },
    portada: { type: "string" },
    borradores: { type: "string" },
  },
});

function fallo(mensaje: string): never {
  console.error("Error: " + mensaje);
  process.exit(1);
}

const id = positionals[0] ?? fallo("indica el id del vídeo: npm run publicar -- <id> --instagram <enlace>");
if (!/^[a-z0-9]+$/.test(id)) fallo(`id no válido: ${id}`);

// Acepta el enlace entero o solo el código.
function codigoInstagram(v: string): string {
  const m = v.match(/\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/) ?? v.match(/^([A-Za-z0-9_-]+)$/);
  return m?.[1] ?? fallo(`no entiendo el enlace de Instagram: ${v}`);
}
function numeroTiktok(v: string): string {
  const m = v.match(/\/video\/(\d+)/) ?? v.match(/^(\d+)$/);
  return m?.[1] ?? fallo(`no entiendo el enlace de TikTok: ${v}`);
}

const instagram = values.instagram ? codigoInstagram(values.instagram) : fallo("falta --instagram");
const tiktok = values.tiktok ? numeroTiktok(values.tiktok) : undefined;
const hoy = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Madrid" });
if (values.fecha && !(/^\d{4}-\d{2}-\d{2}$/.test(values.fecha) && !Number.isNaN(Date.parse(values.fecha)) && new Date(values.fecha).toISOString().startsWith(values.fecha))) {
  fallo(`fecha AAAA-MM-DD que exista: ${values.fecha}`);
}

const raiz = path.join(import.meta.dirname, "..");
// content.ts lee content/videos desde el directorio de trabajo: que sea el mismo que se escribe.
process.chdir(raiz);
const borradores = path.resolve(raiz, values.borradores ?? process.env.BORRADORES ?? "../sideraltechno/web-borradores");
const ficha = path.join(raiz, "content", "videos", `${id}.md`);
const fichaBorrador = path.join(borradores, "videos", `${id}.md`);
const traidos: string[] = [];

// 1. La ficha
if (fs.existsSync(ficha)) {
  console.log(`Ficha ya en la web: content/videos/${id}.md`);
} else if (fs.existsSync(fichaBorrador)) {
  fs.copyFileSync(fichaBorrador, ficha);
  traidos.push(fichaBorrador);
  console.log(`Ficha traída de ${path.relative(raiz, fichaBorrador)}`);
} else {
  fallo(`no hay ficha: ni content/videos/${id}.md ni ${fichaBorrador}. Copia el modelo florida.md.`);
}

// 2. Los campos de publicación, sin tocar el resto del YAML
const ORDEN = ["id", "numero", "titulo", "gancho", "serie", "tipo", "resumen", "estado", "formato", "duracion", "publicado", "actualizado", "instagram", "tiktok"];

function ponerCampo(yaml: string[], clave: string, valor: string) {
  const linea = `${clave}: ${valor}`;
  const i = yaml.findIndex((l) => l.startsWith(`${clave}:`));
  if (i >= 0) {
    yaml[i] = linea;
    return;
  }
  const anteriores = ORDEN.slice(0, ORDEN.indexOf(clave));
  const tras = yaml.findLastIndex((l) => anteriores.some((a) => l.startsWith(`${a}:`)));
  yaml.splice(tras + 1, 0, linea);
}

const texto = fs.readFileSync(ficha, "utf8");
const m = texto.match(/^---\n([\s\S]*?)\n---\n/) ?? fallo(`${id}.md no empieza con un bloque YAML entre ---`);
const yaml = m[1].split("\n");
const leerFecha = (clave: string) => yaml.find((l) => l.startsWith(`${clave}:`))?.match(/\d{4}-\d{2}-\d{2}/)?.[0];
const actualizado = leerFecha("actualizado");
// Si se relanza sobre un vídeo ya publicado, su fecha no cambia salvo que se pida con --fecha.
const fecha = values.fecha ?? leerFecha("publicado") ?? hoy;
ponerCampo(yaml, "estado", "publicado");
ponerCampo(yaml, "publicado", fecha);
if (!actualizado || actualizado < fecha) ponerCampo(yaml, "actualizado", fecha);
ponerCampo(yaml, "instagram", instagram);
if (tiktok) ponerCampo(yaml, "tiktok", `"${tiktok}"`);
fs.writeFileSync(ficha, `---\n${yaml.join("\n")}\n---\n${texto.slice(m[0].length)}`);
console.log(`Publicado el ${fecha} · Instagram ${instagram}${tiktok ? ` · TikTok ${tiktok}` : " · sin TikTok"}`);

// 3. Las portadas: 720×1280 en WebP y 540×960 en JPG (como scripts/portadas.sh).
// Siempre pasan por ImageMagick con -strip: a la web pública no llegan EXIF, GPS ni perfiles de otras herramientas.
const portadas = path.join(raiz, "public", "portadas");
const destinos = [".webp", ".jpg"].map((ext) => path.join(portadas, id + ext));
const deBorrador = [".webp", ".jpg"].map((ext) => path.join(borradores, "portadas", id + ext));
const png = values.portada ? path.resolve(values.portada) : path.join(borradores, "..", "out", "publicar", `portada-${id}.png`);
const portada = (origen: string, destino: string, tam: string, calidad: string) =>
  execFileSync("magick", [origen, "-strip", "-resize", `${tam}>`, "-quality", calidad, destino]);

if (values.portada || !destinos.every((f) => fs.existsSync(f))) {
  if (fs.existsSync(png)) {
    // El PNG del render es el mejor original: se prefiere al borrador, que ya viene comprimido.
    portada(png, destinos[0], "720x1280", "82");
    portada(png, destinos[1], "540x960", "85");
    if (deBorrador.every((f) => fs.existsSync(f))) traidos.push(...deBorrador);
    console.log(`Portadas generadas desde ${png}`);
  } else if (deBorrador.every((f) => fs.existsSync(f))) {
    portada(deBorrador[0], destinos[0], "720x1280", "82");
    portada(deBorrador[1], destinos[1], "540x960", "85");
    traidos.push(...deBorrador);
    console.log("Portadas traídas del borrador (sin metadatos)");
  } else {
    fallo(`no hay portadas de ${id}: ni en public/portadas, ni en el borrador, ni ${png}. Pasa --portada <png>.`);
  }
} else {
  console.log("Portadas ya en la web");
}

// 4. Validar todo el contenido antes de tocar los borradores
const { todosLosVideos } = await import("../src/lib/content.ts");
let videos: ReturnType<typeof todosLosVideos>;
try {
  videos = todosLosVideos();
} catch (e) {
  fallo((e instanceof Error ? e.message : String(e)) + "\nCorrige la ficha y vuelve a lanzar el script: el borrador sigue en su sitio.");
}
const video = videos.find((v) => v.id === id)!;
if (video.relacionadosPendientes?.length) console.log(`Aviso: relacionados aún sin publicar: ${video.relacionadosPendientes.join(", ")}`);
const apuntan = videos.filter((v) => v.relacionados.includes(id)).map((v) => v.id);
if (apuntan.length) console.log(`Ahora enlazan con ${id}: ${apuntan.join(", ")}`);
else console.log(`Ningún vídeo lo tiene en «relacionados»: valora añadirlo en los del mismo tema.`);

for (const f of traidos) fs.rmSync(f);
if (traidos.length) console.log(`Borrador quitado de ${path.relative(raiz, borradores)} (sigue en su historial de git)`);
for (const f of [fichaBorrador, ...deBorrador]) if (fs.existsSync(f)) console.log(`Aviso: queda una copia antigua en ${path.relative(raiz, f)}`);

console.log("\nSiguiente: revisa la ficha (nada de trastienda), npm run comprobar && npm run build, y abre el PR.");
