import type { NextConfig } from "next";

const desarrollo = process.env.NODE_ENV === "development";

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
  experimental: { inlineCss: true },
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
  async redirects() {
    return ["/videos", "/fuentes", "/correcciones", "/sobre", "/buscar", "/series/:slug"].map((source) => ({ source, destination: "/", permanent: false }));
  },
  async headers() {
    return [
      { source: "/:path*", headers: seguridad },
      { source: "/portadas/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
    ];
  },
};

export default nextConfig;
