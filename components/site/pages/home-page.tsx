import Link from "next/link";
import { JsonLd } from "@/components/site/json-ld";
import { HeroPanel, PrimaryLink, Section } from "@/components/site/page-shell";
import { articles, blogCategories } from "@/lib/blog";
import { IndicatorCard } from "@/components/site/indicator-card";
import { findIndicator } from "@/lib/site-data";
export function HomePage() {
 const selected = [1,8,35,48,68,90].flatMap(id => { const a = articles.find(x => x.id === id); return a ? [a] : []; });
 return <div>
  <JsonLd data={{"@context":"https://schema.org","@type":"WebSite",name:"港股證據研究室",url:"https://technical-indicators-hk.teabonvivant.chatgpt.site/",inLanguage:"zh-Hant-HK"}} />
  <HeroPanel eyebrow="港股技術分析與市場教育" title={<>讀懂價格，<br />也讀懂它的分寸。</>} body="一條線，一次突破，一份漂亮的回測，都值得多問一句。從圖表、公式到市場機制，整理可以查證的知識，讓每個判斷都有來處。" imageKey="home" actions={<><PrimaryLink href="/blog">閱讀研究札記</PrimaryLink><PrimaryLink href="/learn" variant="secondary">從基礎開始</PrimaryLink></>} />
  <nav className="home-topic-band" aria-label="主題入口">{blogCategories.map(c => <Link key={c.slug} href={`/blog/category/${c.slug}`}><strong>{c.name}</strong><span>{c.description}</span></Link>)}</nav>
  <Section title="從一個具體問題開始" body="每篇文章附上圖解、例子及參考資料。">
   <div className="article-list home-articles">{selected.map(a => <article key={a.slug}><span className="article-meta">{a.category}</span><h3><Link href={`/blog/${a.slug}`}>{a.title}</Link></h3><p>{a.excerpt}</p><Link className="text-link" href={`/blog/${a.slug}`}>閱讀全文 →</Link></article>)}</div>
   <Link className="text-link section-end-link" href="/blog">瀏覽全部 {articles.length} 篇研究札記 →</Link>
  </Section>
  <Section title="把基礎放穩" body="價格位置、趨勢、動能、成交量和波幅，各自回答不同的問題。">
   <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{["support-resistance","ema","rsi","volume","atr"].flatMap(slug => {const i=findIndicator(slug);return i ? [<IndicatorCard key={slug} item={i} />] : [];})}</div>
  </Section>
  <Section title="讀過以後，親手核對一次">
   <div className="resource-columns"><div><h3>風險計算</h3><p>輸入資金、止蝕距離和每手股數，觀察風險預算如何影響持倉。</p><Link href="/toolbox">打開計算工具 →</Link></div><div><h3>歷史圖表</h3><p>從保存的港股與美股日線，練習辨認趨勢、波幅和價格位置。</p><Link href="/casebook">查看圖表案例 →</Link></div><div><h3>策略與程式</h3><p>把構思分成條件、事件、訂單與退出，再檢查回測的時間順序。</p><Link href="/script">閱讀 Pine Script 教學 →</Link></div></div>
  </Section>
  <div className="editorial-note"><h2>知識的價值，在於可以追問。</h2><p>原始文件、計算口徑和適用範圍，是這裏每一頁的閱讀線索。歷史圖表用來理解已發生的事情；圖解算例用來拆開概念。兩者各有用途。</p><Link href="/trust">了解本站的內容與方法 →</Link></div>
 </div>;
}
