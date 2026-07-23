import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";
import { trustContentFor, trustRoutePaths } from "@/lib/trust-content";

const publicPaths = [
  "",
  "/learn",
  "/indicators",
  "/compare",
  "/casebook",
  "/glossary",
  "/toolbox",
  "/strategy-cases",
  "/tv-strategies",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const trustPaths = trustRoutePaths.flatMap((path) => (
    trustContentFor(path).indexable ? [`/${path}`] : []
  ));

  return [...publicPaths, ...trustPaths].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: "2026-07-24",
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/indicators" ? 0.9 : 0.7,
  }));
}
