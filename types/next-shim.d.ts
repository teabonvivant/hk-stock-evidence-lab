declare module "next" {
  export type Metadata = {
    readonly title?: string;
    readonly description?: string;
    readonly metadataBase?: URL;
    readonly applicationName?: string;
    readonly alternates?: {
      readonly canonical?: string | URL;
    };
    readonly robots?: string | {
      readonly index?: boolean;
      readonly follow?: boolean;
    };
    readonly openGraph?: {
      readonly title?: string;
      readonly description?: string;
      readonly type?: string;
      readonly locale?: string;
      readonly url?: string | URL;
      readonly siteName?: string;
    };
  };

  export namespace MetadataRoute {
    type RobotsRule = {
      readonly userAgent?: string | readonly string[];
      readonly allow?: string | readonly string[];
      readonly disallow?: string | readonly string[];
      readonly crawlDelay?: number;
    };

    type Robots = {
      readonly rules: RobotsRule | readonly RobotsRule[];
      readonly sitemap?: string | readonly string[];
      readonly host?: string;
    };

    type SitemapEntry = {
      readonly url: string;
      readonly lastModified?: string | Date;
      readonly changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
      readonly priority?: number;
    };

    type Sitemap = readonly SitemapEntry[];
  }
}

declare module "next/link" {
  import type { AnchorHTMLAttributes, ReactNode } from "react";

  export default function Link(
    props: AnchorHTMLAttributes<HTMLAnchorElement> & {
      readonly href: string;
      readonly children?: ReactNode;
    },
  ): ReactNode;
}

declare module "next/image" {
  import type { ReactNode } from "react";

  export default function Image(props: {
    readonly src: string;
    readonly alt: string;
    readonly fill?: boolean;
    readonly priority?: boolean;
    readonly unoptimized?: boolean;
    readonly className?: string;
    readonly sizes?: string;
    readonly width?: number;
    readonly height?: number;
  }): ReactNode;
}

declare module "next/types.js" {
  import type { Metadata } from "next";

  export type ResolvingMetadata = Promise<Metadata>;
  export type ResolvingViewport = Promise<unknown>;
}
