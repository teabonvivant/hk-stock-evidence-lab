import { publicPath } from "@/lib/site-config";
import Link from "@/components/site/site-link";
import { Search, ArrowRight } from "lucide-react";

export function HomeCover() {
  return <section className="research-start" aria-labelledby="home-title">
    <div className="research-start__intro">
      <div className="research-start__copy">
        <h1 id="home-title">讀懂價格，也讀懂它的分寸。</h1>
        <p>港股技術指標、圖表教學與研究方法。從基本概念到市場案例，讀懂指標回答甚麼、資料從哪裏來，以及方法有甚麼限制。</p>
      </div>
      <figure className="research-start__visual">
        <img src={publicPath("/illustrations/home/research-lab.svg")} width="720" height="260" alt="價格路徑與下方成交量柱共用時間軸，價格在參考區域附近反覆移動；圖形只示範觀察方式，沒有使用市場數據。" />
        <figcaption>價格位置 × 成交量 <span>觀察示意 · 非市場數據</span></figcaption>
      </figure>
    </div>
    <nav className="home-pathways" aria-label="選擇閱讀方式">
      <Link href="/learn" className="home-pathway home-pathway--learn">
        <strong>開始學習</strong><span>由價格、圖表和基本概念入手</span><ArrowRight size={18} aria-hidden="true" />
      </Link>
      <Link href="/indicators" className="home-pathway home-pathway--find">
        <strong>查找指標</strong><span>搜尋用法、公式和適用範圍</span><ArrowRight size={18} aria-hidden="true" />
      </Link>
      <Link href="/blog" className="home-pathway home-pathway--read">
        <strong>閱讀研究</strong><span>從圖解和例子理解具體問題</span><ArrowRight size={18} aria-hidden="true" />
      </Link>
    </nav>
    <form action={publicPath("/indicators/")} className="home-search" role="search" aria-label="搜尋技術指標">
      <Search size={20} aria-hidden="true" />
      <label htmlFor="home-indicator-search" className="home-search__label">直接搜尋指標</label>
      <input id="home-indicator-search" name="q" type="search" autoComplete="off" placeholder="輸入名稱或用途，例如 RSI、成交量…" />
      <button type="submit">搜尋<ArrowRight size={17} aria-hidden="true" /></button>
    </form>
  </section>;
}
