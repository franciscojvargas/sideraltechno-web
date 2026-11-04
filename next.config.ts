import type { NextConfig } from "next";
import { IDIOMAS as idiomas, IDIOMA_ORIGINAL as original } from "./src/lib/idiomas.ts";

const desarrollo = process.env.NODE_ENV === "development";
const ID = "[a-z0-9]+";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${desarrollo ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self' https:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const seguridad = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  experimental: { inlineCss: true, globalNotFound: true },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1440],
    imageSizes: [192, 256, 384],
    qualities: [70],
    minimumCacheTTL: 2678400,
  },
  turbopack: {
    root: import.meta.dirname,
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
  // El español no lleva prefijo: / y /videos/:id se reescriben por dentro a /es/… y cualquier /es/… externo vuelve a la URL sin prefijo.
  // Reglas explícitas, sin /:path*, para que ninguna redirección pueda salir del dominio.
  async redirects() {
    const antiguas = ["/videos", "/fuentes", "/correcciones", "/sobre", "/buscar", "/series/:slug"];
    const otros = idiomas.filter((i) => i !== original);
    return [
      ...antiguas.map((source) => ({ source, destination: "/", permanent: false })),
      ...otros.flatMap((i) => antiguas.map((source) => ({ source: `/${i}${source}`, destination: `/${i}`, permanent: false }))),
      { source: `/${original}`, destination: "/", permanent: true },
      { source: `/${original}/videos/:id(${ID})`, destination: "/videos/:id", permanent: true },
      { source: `/${original}/og.png`, destination: "/og.png", permanent: true },
      { source: `/${original}/videos/:id(${ID})/og.png`, destination: "/videos/:id/og.png", permanent: true },
      // Las imágenes sociales cambiaron de nombre: las vistas previas ya guardadas siguen funcionando.
      { source: "/opengraph-image", destination: "/og.png", permanent: true },
      { source: `/videos/:id(${ID})/opengraph-image`, destination: "/videos/:id/og.png", permanent: true },
    ];
  },
  async rewrites() {
    return {
      afterFiles: [
        { source: "/", destination: `/${original}` },
        { source: "/og.png", destination: `/${original}/og.png` },
        { source: `/videos/:id(${ID})`, destination: `/${original}/videos/:id` },
        { source: `/videos/:id(${ID})/og.png`, destination: `/${original}/videos/:id/og.png` },
      ],
    };
  },
  async headers() {
    const sociales = ["/og.png", "/videos/:id/og.png", ...idiomas.flatMap((i) => [`/${i}/og.png`, `/${i}/videos/:id/og.png`])];
    return [
      { source: "/:path*", headers: seguridad },
      { source: "/portadas/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
      // Imágenes públicas: los lectores RSS y las vistas previas de otras webs deben poder mostrarlas.
      ...["/portadas/:path*", ...sociales].map((source) => ({ source, headers: [{ key: "Cross-Origin-Resource-Policy", value: "cross-origin" }] })),
    ];
  },
};

export default nextConfig;
