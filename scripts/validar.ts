import { todosLosVideos } from "../src/lib/content.ts";

try {
  const videos = todosLosVideos();
  const publicados = videos.filter((v) => v.estado === "publicado").length;
  const fuentes = videos.reduce((n, v) => n + v.fuentes.length, 0);
  const sinUrl = videos.flatMap((v) => v.fuentes.filter((f) => !f.url).map((f) => `${v.id}:${f.clave}`));
  console.log(`OK: ${videos.length} vídeos (${publicados} publicados), ${fuentes} fuentes, ${sinUrl.length} sin enlace.`);
  for (const v of videos) {
    const avisos: string[] = [];
    if (v.cifras.length === 0) avisos.push("sin cifras");
    if (v.estado === "publicado" && !v.instagram) avisos.push("sin reel de Instagram");
    const palabras = v.cuerpoPlano.split(" ").length;
    if (palabras > 180) avisos.push(`texto largo (${palabras} palabras; mejor entre 90 y 140)`);
    if (v.resumen.length > 160) avisos.push(`resumen de ${v.resumen.length} caracteres: Google corta hacia los 160`);
    if (v.relacionadosPendientes?.length) avisos.push(`relacionados aún sin publicar: ${v.relacionadosPendientes.join(", ")}`);
    if (avisos.length) console.log(`  Aviso ${v.numero} ${v.id}: ${avisos.join("; ")}`);
  }
} catch (e) {
  console.error("Error: " + (e instanceof Error ? e.message : String(e)));
  process.exit(1);
}
