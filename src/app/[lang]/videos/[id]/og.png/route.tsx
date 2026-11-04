import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { todosLosVideos, videoPorId, videosPublicados } from "@/lib/content";
import { IDIOMAS, esIdioma } from "@/lib/idiomas";
import { MOSTRAR_BORRADORES } from "@/lib/sitio";
import { TEXTOS } from "@/lib/textos";

// Route handler y no opengraph-image, por lo mismo que en ../../og.png/route.tsx.
export function generateStaticParams() {
  const videos = MOSTRAR_BORRADORES ? todosLosVideos() : videosPublicados();
  return IDIOMAS.flatMap((lang) => videos.map((v) => ({ lang, id: v.id })));
}

export async function GET(_peticion: Request, { params }: RouteContext<"/[lang]/videos/[id]/og.png">) {
  const { lang, id } = await params;
  const v = videoPorId(id);
  // El id llega de la URL: sin vídeo visible no se toca el disco.
  if (!esIdioma(lang) || !v || (v.estado !== "publicado" && !MOSTRAR_BORRADORES)) return new Response(null, { status: 404 });
  const t = TEXTOS[lang].imagen;
  const titulo = v.titulo;
  const portada = `data:image/jpeg;base64,${fs.readFileSync(path.join(process.cwd(), "public", "portadas", `${v.id}.jpg`)).toString("base64")}`;
  const bold = fs.readFileSync(path.join(process.cwd(), "src", "fuentes", "arimo-700.woff"));
  const regular = fs.readFileSync(path.join(process.cwd(), "src", "fuentes", "arimo-400.woff"));

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0B0C0C", color: "#F2F2EC", fontFamily: "Arimo" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 56px 56px 64px", width: 820 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column", fontWeight: 700, fontSize: 30, lineHeight: 0.95, textTransform: "uppercase" }}>
              <span>Sideral</span>
              <span>Techno</span>
            </div>
            <div style={{ width: 44, height: 4, background: "#FF2C1C", marginTop: 10 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 18, letterSpacing: 3, textTransform: "uppercase", color: "#8E908A", marginBottom: 18 }}>{v.serie}</div>
            <div style={{ fontSize: titulo.length > 60 ? 48 : 58, fontWeight: 700, lineHeight: 1.02, textTransform: "uppercase", letterSpacing: -1 }}>{titulo}</div>
            <div style={{ fontSize: 18, color: "#8E908A", marginTop: 24, letterSpacing: 2, textTransform: "uppercase" }}>{t.miralo}</div>
          </div>
        </div>
        <div style={{ display: "flex", width: 380, height: 630, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori no usa next/image */}
          <img src={portada} alt="" width={380} height={676} style={{ objectFit: "cover", width: 380, height: 630 }} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Arimo", data: bold, weight: 700, style: "normal" },
        { name: "Arimo", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
