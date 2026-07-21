declare module "next" {
  export type Metadata = {
    readonly title?: string;
    readonly description?: string;
    readonly openGraph?: {
      readonly title?: string;
      readonly description?: string;
      readonly type?: string;
      readonly locale?: string;
    };
  };
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
