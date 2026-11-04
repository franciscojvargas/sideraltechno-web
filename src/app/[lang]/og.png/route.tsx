import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { IDIOMAS, esIdioma } from "@/lib/idiomas";
import { TEXTOS } from "@/lib/textos";

// Route handler y no opengraph-image: así no se inyecta en las páginas con la ruta interna /es/… y cada página declara su URL pública.
export function generateStaticParams() {
  return IDIOMAS.map((lang) => ({ lang }));
}

export async function GET(_peticion: Request, { params }: RouteContext<"/[lang]/og.png">) {
  const { lang } = await params;
  if (!esIdioma(lang)) return new Response(null, { status: 404 });
  const t = TEXTOS[lang].imagen;
  const bold = fs.readFileSync(path.join(process.cwd(), "src", "fuentes", "arimo-700.woff"));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0B0C0C", color: "#F2F2EC", padding: 72, fontFamily: "Arimo" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", fontWeight: 700, fontSize: 132, lineHeight: 0.9, textTransform: "uppercase" }}>
            <span>Sideral</span>
            <span>Techno</span>
          </div>
          <div style={{ width: 120, height: 9, background: "#FF2C1C", marginTop: 26 }} />
        </div>
        <div style={{ fontSize: 30, color: "#8E908A", textTransform: "uppercase", letterSpacing: 4 }}>{t.lema}</div>
      </div>
    ),
    { width: 1200, height: 630, fonts: [{ name: "Arimo", data: bold, weight: 700, style: "normal" }] },
  );
}
