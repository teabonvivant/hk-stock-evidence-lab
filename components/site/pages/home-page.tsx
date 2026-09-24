import { siteConfig } from "@/lib/site-config";
import Link from "@/components/site/site-link";
import { JsonLd } from "@/components/site/json-ld";
import { Section } from "@/components/site/page-shell";
import { articles, articleSummary } from "@/lib/blog";
import { ArticleCard } from "@/components/site/article-card";
import { IndicatorCard } from "@/components/site/indicator-card";
import { findIndicator } from "@/lib/site-data";
import { HomeCover } from "@/components/site/home-cover";
export function HomePage() {
 const selected = [1,8,35,48].flatMap(id => { const a = articles.find(x => x.id === id); return a ? [a] : []; });
 return <div className="home-journal">
  <JsonLd data={{"@context":"https://schema.org","@type":"WebSite",name:"港股證據研究室",url:siteConfig.url+"/",inLanguage:"zh-Hant-HK"}} />
  <HomeCover />
  <Section className="home-reading" title="從一個具體問題開始" body="每篇文章附上圖解、例子及參考資料。">
   <div className="home-featured-reading">
    {selected[0] && <div className="home-featured-primary"><ArticleCard article={articleSummary(selected[0])} heading="h3" /></div>}
    <aside className="home-featured-related" aria-label="更多精選研究">
     <h3>繼續閱讀</h3>
     <ul className="home-quick-reads">{selected.slice(1).map(a => <li key={a.slug}><Link className="home-quick-read" href={`/blog/${a.slug}`}><span>{a.category}</span><strong>{a.title}</strong></Link></li>)}</ul>
    </aside>
   </div>
   <Link className="text-link section-end-link" href="/blog">瀏覽全部 {articles.length} 篇研究札記 →</Link>
  </Section>
  <Section className="home-foundations" title="把基礎放穩" body="價格位置、趨勢、動能、成交量和波幅，各自回答不同的問題。">
   <div className="foundation-list">{["support-resistance","ema","rsi","volume","atr"].flatMap(slug => {const i=findIndicator(slug);return i ? [<IndicatorCard key={slug} item={i} />] : [];})}</div>
  </Section>
  <Section title="讀過以後，親手核對一次">
   <div className="resource-columns"><div><h3>風險計算</h3><p>輸入資金、止蝕距離和每手股數，觀察風險預算如何影響持倉。</p><Link href="/toolbox">打開計算工具 →</Link></div><div><h3>歷史圖表</h3><p>從保存的港股與美股日線，練習辨認趨勢、波幅和價格位置。</p><Link href="/casebook">查看圖表案例 →</Link></div><div><h3>策略與程式</h3><p>把構思分成條件、事件、訂單與退出，再檢查回測的時間順序。</p><Link href="/script">閱讀 Pine Script 教學 →</Link></div></div>
  </Section>
  <div className="editorial-note"><h2>知識的價值，在於可以追問。</h2><p>原始文件、計算口徑和適用範圍，是這裏每一頁的閱讀線索。歷史圖表用來理解已發生的事情；圖解算例用來拆開概念。兩者各有用途。</p><Link href="/trust">了解本站的內容與方法 →</Link></div>
 </div>;
}
