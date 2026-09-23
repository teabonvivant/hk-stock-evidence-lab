import { publicPath } from "@/lib/site-config";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

export function HomeCover() {
  return <section className="research-start">
    <div className="research-start__intro">
      <div><h1>讀懂價格，也讀懂它的分寸。</h1><p>一條線，一次突破，一份漂亮的回測，都值得多問一句。從圖表、公式到市場機制，整理可以查證的知識，讓每個判斷都有來處。</p></div>
      <Link href="/learn" className="start-learning"><strong>第一次接觸技術分析？</strong><span>從基礎開始，逐步建立判讀方法<ArrowRight size={18} aria-hidden="true" /></span></Link>
    </div>
    <form action={publicPath("/indicators/")} className="home-search" role="search">
      <label htmlFor="home-indicator-search" className="sr-only">搜尋技術指標</label>
      <Search size={21} aria-hidden="true" />
      <input id="home-indicator-search" name="q" type="search" placeholder="搜尋指標、名稱或用途，例如 RSI、成交量、趨勢…" />
      <button type="submit">搜尋指標<ArrowRight size={17} aria-hidden="true" /></button>
    </form>
    <div className="home-search__shortcuts"><span>常用指標</span>{[["rsi","RSI"],["macd","MACD"],["bollinger-bands","保力加通道"],["volume","成交量"],["atr","ATR"]].map(([slug,label]) => <Link href={`/indicators/${slug}`} key={slug}>{label}</Link>)}<Link href="/indicators" className="all-indicators">全部 82 個指標 →</Link></div>
  </section>;
}
