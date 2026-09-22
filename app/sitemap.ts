import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { staticRouteParams } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRouteParams().map(({slug}) => ({
    url: siteConfig.url + (slug.length ? "/" + slug.join("/") : ""),
    lastModified: "2026-09-22",
    changeFrequency: slug.length === 0 ? "weekly" : "monthly",
    priority: slug.length === 0 ? 1 : slug.length === 1 ? 0.9 : 0.7,
  }));
}
