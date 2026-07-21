import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

import "./globals.css";

const enableReactDevTools = process.env.NODE_ENV === "development"
  && process.env["NEXT_PUBLIC_DISABLE_REACT_DEVTOOLS"] !== "1";

export const metadata: Metadata = {
  title: "技術指標研究室",
  description: "以香港讀者角度整理技術指標、TradingView 策略、Pine Script 教學範本同回測檢查。",
  openGraph: {
    title: "技術指標研究室",
    description: "用本地資料包整理指標、策略案例、研究來源同交易前風控檢查。",
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
