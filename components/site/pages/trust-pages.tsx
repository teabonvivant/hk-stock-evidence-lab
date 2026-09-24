import { siteConfig } from "@/lib/site-config";
import Link from "@/components/site/site-link";

import { DirectAnswer } from "@/components/site/direct-answer";
import { JsonLd } from "@/components/site/json-ld";
import { Badge } from "@/components/ui/badge";
import { trustContentFor } from "@/lib/trust-content";
import type { TrustRoutePath } from "@/lib/trust-content";
import { CorrectionNote } from "@/components/site/learning-tools";

export function TrustPage({ path }: { readonly path: TrustRoutePath }) {
  const content = trustContentFor(path);
  const pageUrl = `${siteConfig.url}/${path}`;

  return (
    <article className="policy-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: content.title,
          description: content.description,
          url: pageUrl,
          inLanguage: "zh-Hant-HK",
          dateModified: path === "privacy" || path === "trust" ? "2026-09-23" : "2026-09-22",
        }}
      />
      <nav aria-label="頁面路徑" className="breadcrumbs">
        <Link href="/">首頁</Link><span aria-hidden="true">/</span>
        {path === "trust" ? <span>關於與方法</span> : <><Link href="/trust">關於與方法</Link><span aria-hidden="true">/</span><span>{content.eyebrow}</span></>}
      </nav>
      <header className="policy-header">
        <p>{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
        <dl>
          <div><dt>{content.versionLabel}</dt><dd>{content.version}</dd></div>
          <div><dt>更新日期</dt><dd>{path === "privacy" || path === "trust" ? "2026-09-23" : "2026-09-22"}</dd></div>
        </dl>
      </header>

      <DirectAnswer answer={content.directAnswer} takeaways={content.sections.map((section) => section.points[0] ?? section.body)} />

      {path === "methodology/data" ? (
        <section className="trust-method-flow" aria-labelledby="trust-method-flow-title">
          <h2 id="trust-method-flow-title">由資料到圖表，逐項核對</h2>
          <ol>
            <li>
              <strong>先看來源</strong>
              <p>歷史頁使用保存的 Yahoo Finance 日線資料，並列出供應商、下載日期和資料請求連結。</p>
            </li>
            <li>
              <strong>對齊資料口徑</strong>
              <p>核對證券、交易所、貨幣、時段、時區及價格處理方式；公司行動和缺失資料亦會影響比較。</p>
            </li>
            <li>
              <strong>再看計算範圍</strong>
              <p>指標先用完整保存期間累積計算，再截取圖中最後 110 根；預熱與初值可能令結果不同。</p>
            </li>
            <li>
              <strong>分清圖表用途</strong>
              <p>歷史圖表展示保存的市場資料；概念圖解用於計算、比較和教學算例，兩者不應混作實際行情。</p>
            </li>
          </ol>
        </section>
      ) : null}

      <nav aria-label="本頁目錄" className="policy-toc">
        <strong>本頁內容</strong>
        <ol>
          {content.sections.map((section, index) => (
            <li key={section.title}><a href={`#policy-section-${index + 1}`}>{section.title}</a></li>
          ))}
        </ol>
      </nav>

      <div className="policy-sections">
        {content.sections.map((section, index) => (
          <section key={section.title} id={`policy-section-${index + 1}`}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
            <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>
          </section>
        ))}
      </div>

      {path === "contact/report-error" ? <section className="policy-sections"><h2>整理修訂筆記</h2><CorrectionNote /></section> : null}
      <section className="related-policies">
        <h2>相關政策與方法</h2>
        <div>
          {content.related.map((relatedPath) => {
            const related = trustContentFor(relatedPath);
            return <Link key={relatedPath} href={`/${relatedPath}`}><span>{related.eyebrow}</span><strong>{related.title}</strong></Link>;
          })}
        </div>
      </section>

      <aside className="policy-report">
        <div><strong>發現內容、公式或資料問題？</strong><p>請保存網址、重現步驟與可核對來源。</p></div>
        <Link href="/contact/report-error">整理修訂筆記</Link>
      </aside>
    </article>
  );
}
