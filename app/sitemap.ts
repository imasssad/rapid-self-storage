import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: brand.url, changeFrequency: "monthly", priority: 1 }];
}
