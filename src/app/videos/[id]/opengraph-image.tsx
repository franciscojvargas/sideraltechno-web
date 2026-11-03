import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { todosLosVideos, videoPorId, videosPublicados } from "@/lib/content";
import { MOSTRAR_BORRADORES } from "@/lib/sitio";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sideral Techno";

export function generateStaticParams() {
  return (MOSTRAR_BORRADORES ? todosLosVideos() : videosPublicados()).map((v) => ({ id: v.id }));
}

export default async function Imagen({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = videoPorId(id);
  const titulo = v?.titulo ?? "Sideral Techno";
  const portada = `data:image/jpeg;base64,${fs.readFileSync(path.join(process.cwd(), "public", "portadas", `${id}.jpg`)).toString("base64")}`;
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
            <div style={{ fontSize: 18, letterSpacing: 3, textTransform: "uppercase", color: "#8E908A", marginBottom: 18 }}>{v?.serie}</div>
            <div style={{ fontSize: titulo.length > 60 ? 48 : 58, fontWeight: 700, lineHeight: 1.02, textTransform: "uppercase", letterSpacing: -1 }}>{titulo}</div>
            <div style={{ fontSize: 18, color: "#8E908A", marginTop: 24, letterSpacing: 2, textTransform: "uppercase" }}>Míralo en Instagram: @sideral_techno</div>
          </div>
        </div>
        <div style={{ display: "flex", width: 380, height: 630, overflow: "hidden" }}>
          <img src={portada} alt="" width={380} height={676} style={{ objectFit: "cover", width: 380, height: 630 }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Arimo", data: bold, weight: 700, style: "normal" },
        { name: "Arimo", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
