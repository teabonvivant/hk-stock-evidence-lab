import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const enableReactDevTools = process.env.NODE_ENV === "development"
  && process.env["NEXT_PUBLIC_DISABLE_REACT_DEVTOOLS"] !== "1";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    title: `${siteConfig.name}｜${siteConfig.englishName}`,
    description: siteConfig.description,
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="zh-Hant-HK">
      <head>
        {enableReactDevTools ? (
          <>
            <Script
              src="//unpkg.com/react-grab/dist/index.global.js"
              crossOrigin="anonymous"
              strategy="beforeInteractive"
            />
            <Script
              src="//unpkg.com/react-scan/dist/auto.global.js"
              crossOrigin="anonymous"
              strategy="beforeInteractive"
            />
          </>
        ) : null}
      </head>
      <body>{children}</body>
    </html>
  );
}
