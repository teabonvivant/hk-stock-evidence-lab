import NextLink from "next/link";
import type { ComponentProps } from "react";
import { basePath } from "@/lib/site-config";

type SiteLinkProps = ComponentProps<"a"> & { href: string };

/** GitHub Pages serves .rsc as a download; use ordinary document navigation. */
export default function SiteLink({ href, ...props }: SiteLinkProps) {
  if (!basePath) return <NextLink href={href} {...props} />;
  if (!href.startsWith("/") || href.startsWith("//")) return <a href={href} {...props} />;

  const split = href.search(/[?#]/);
  const pathname = split < 0 ? href : href.slice(0, split);
  const suffix = split < 0 ? "" : href.slice(split);
  const trailingSlash = pathname.endsWith("/") || /\.[^/]+$/.test(pathname) ? "" : "/";
  return <a href={`${basePath}${pathname}${trailingSlash}${suffix}`} {...props} />;
}
