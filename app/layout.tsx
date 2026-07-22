import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "技術指標研究室",
  description: "從香港投資者角度整理技術指標、TradingView 策略審核、Pine Script 教學範本及回測檢查。",
  openGraph: {
    title: "技術指標研究室",
    description: "查閱 82 個技術指標、策略案例、研究來源及交易前風險檢查。",
  },
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="zh-Hant-HK">
      <body>{children}</body>
    </html>
  );
}
