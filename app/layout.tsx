import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
