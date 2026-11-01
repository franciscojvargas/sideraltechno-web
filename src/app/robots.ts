import type { MetadataRoute } from "next";
import { SITIO } from "@/lib/sitio";

export default function robots(): MetadataRoute.Robots {
  const produccion = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
  return {
    rules: produccion ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: `${SITIO.url}/sitemap.xml`,
    host: SITIO.url,
  };
}
