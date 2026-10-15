import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] }, sitemap: `${brand.url}/sitemap.xml` };
}
