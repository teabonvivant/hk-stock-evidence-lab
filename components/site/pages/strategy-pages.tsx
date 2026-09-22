import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroPanel, PrimaryLink, Section } from "@/components/site/page-shell";
import { strategyLessonFor, strategyLessons } from "@/lib/strategy-lessons";
export function StrategyCasesPage() {
 return <><HeroPanel eyebrow="策略方法" title="把一個構思，拆成可以檢驗的條件。" body="十種方法，從趨勢、區間到形態與程式框架。逐項閱讀它需要甚麼資料、何時產生訊號、怎樣退出，以及哪些環境容易失效。" imageKey="tv" actions={<PrimaryLink href="/tv-strategies">先了解回測方法</PrimaryLink>}/><Section title="十個研究起點"><div className="article-list">{strategyLessons.map(s=><article key={s.slug}><span className="article-meta">{s.category}</span><h2><Link href={`/strategy-cases/${s.slug}`}>{s.title}</Link></h2><p>{s.intro}</p><Link className="text-link" href={`/strategy-cases/${s.slug}`}>拆解研究方法 →</Link></article>)}</div></Section><Section title="怎樣閱讀這些方法"><p>這些頁面整理教學構思與測試設計。所列參數用來說明規則，不提供績效預測；實際結果取決於資料、期間、成本和執行條件。</p><Link className="text-link" href="/blog/category/backtesting">閱讀回測專題 →</Link></Section></>;
}
export function StrategyDetailPage({slug}:{slug:string}) {
 const s=strategyLessonFor(slug);if(!s)notFound();
 const sections=[["資料與前提",s.setup],["觸發與時間",s.trigger],["退出與股數",s.exit],["容易失效的地方",s.failure],["如何設計比較",s.test]];
 return <><nav className="breadcrumbs" aria-label="頁面路徑"><Link href="/">首頁</Link><span>/</span><Link href="/strategy-cases">策略方法</Link></nav><HeroPanel eyebrow={s.category} title={s.title} body={s.intro} imageKey="tv"/><div className="method-article">{sections.map(([title,body])=><Section key={title} title={title!}><p>{body}</p></Section>)}</div><Section title="延伸工具與原始文件"><div className="topic-links"><Link href={`/indicators/${s.indicator}`}>相關指標</Link><Link href="/toolbox">風險計算</Link><Link href="/journal">記錄研究結果</Link></div><p className="source-line"><a href="https://www.tradingview.com/pine-script-docs/concepts/strategies/" target="_blank" rel="noreferrer">TradingView：策略計算與訂單模擬 ↗</a></p></Section><Section title="其他方法"><div className="link-index">{strategyLessons.filter(x=>x.slug!==slug).slice(0,4).map(x=><Link key={x.slug} href={`/strategy-cases/${x.slug}`}>{x.title}</Link>)}</div></Section></>;
}
export function TradingViewTeachingPage() {
 const steps=[
 ["先固定研究問題","記錄市場、證券、資料週期、日期與貨幣。指定要研究的是哪種事件，以及比較的基準；不要先調參數，再替結果尋找理由。"],
 ["把規則寫成可執行條件","分開市況、訊號、訂單和退出。說明一根燭何時確認、是否允許加倉、反向訂單如何處理，以及日內同時碰到止賺止蝕時採用甚麼成交模型。"],
 ["在標準圖表上檢查","以真實 OHLC 作成交基礎。平均燭、Renko 等轉換圖可以用於訊號研究，但合成價格與可成交價格須分開。"],
 ["在策略屬性加入成本","記錄初始資金、股數、佣金、滑價和保證金設定。滑價的單位可能是最小跳動，必須乘以該商品的最小價位，才知道價格距離。"],
 ["逐筆對照交易明細","選幾笔可以手算的交易，核對訊號時間、成交時間、數量、費用和退出。只有总收益相近，未必代表成交明細一致。"],
 ["用另一段資料檢驗","把設計資料與測試資料按時間分開。使用測試期調參數之後，那段資料已參與設計，需要重新保留獨立期間。"],
 ];
 return <><HeroPanel eyebrow="TradingView 回測教學" title="曲線之下，還有一整套假設。" body="回測把規則放進歷史資料，回答的是「按這組設定會發生甚麼」。閱讀報告時，要把收益、交易次數、回撤與成交條件放在一起。" imageKey="tv"/><Section title="一個可以重現的工作次序"><ol className="learning-road">{steps.map(([t,b],i)=><li key={t}><span>{i+1}</span><div><h3>{t}</h3><p>{b}</p></div></li>)}</ol></Section><Section title="四項數字，一起閱讀"><dl className="glossary-list"><div><dt>總收益</dt><dd>先對齊起始資金、複利、投入資金和成本，再與同期間基準比較。</dd></div><div><dt>盈利因子</dt><dd>總盈利除以總虧損的絕對值；少量樣本或極少虧損可令比率不穩定。</dd></div><div><dt>最大回撤</dt><dd>由歷史資金高點向下量度；只用收市資金與包含盤中損益的口徑不同。</dd></div><div><dt>交易次數</dt><dd>留意交易是否集中於同一波行情；數量多不等於每筆彼此獨立。</dd></div></dl></Section><Section title="繼續研究"><div className="topic-links"><Link href="/blog/category/backtesting">16 篇回測方法文章</Link><Link href="/blog/category/pine-script">Pine Script 專題</Link><Link href="/methodology/backtesting">本站回測方法</Link></div><p className="source-line"><a href="https://www.tradingview.com/pine-script-docs/concepts/strategies/" target="_blank" rel="noreferrer">TradingView 官方策略文件 ↗</a></p></Section></>;
}
