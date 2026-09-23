import Link from "@/components/site/site-link";
import type { ReactNode } from "react";

import { EvidenceVisual } from "@/components/site/evidence-visual";
import type { EvidenceVisualVariant } from "@/components/site/evidence-visual";
import { MobileNavigation, SiteNavigation } from "@/components/site/site-navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageShell({ children }: { readonly children: ReactNode }) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        跳到主要內容
      </a>
      <header className="site-header">
        <div className="page-wrap site-header__inner">
          <Link href="/" className="site-brand" aria-label="港股證據研究室首頁">
            <span aria-hidden="true">證</span>
            <strong>
              港股證據研究室
              <small>HK STOCK EVIDENCE LAB</small>
            </strong>
          </Link>
          <SiteNavigation />
        </div>
      </header>
      <main id="main-content" className="page-wrap py-6 md:py-8">
        {children}
      </main>
      <footer className="accountability-footer">
        <div className="page-wrap accountability-footer__grid">
          <div>
            <strong>港股證據研究室</strong>
            <p>從價格、成交量與市場機制出發，閱讀有來源的技術分析。© 2026 港股證據研究室。</p>
            <Link href="/sitemap">網站導覽</Link> · <Link href="/blog">研究札記</Link> · <Link href="/subscribe">內容更新</Link>
          </div>
          <FooterGroup title="責任與政策" links={policyLinks} />
          <FooterGroup title="方法與修訂" links={methodLinks} />
          <div>
            <strong>閱讀與使用</strong>
            <p>內容供金融教育與研究，不構成個人投資建議。歷史表現及教學算例不代表未來結果。</p>
            <Link href="/contact/report-error" className="footer-report-link">整理內容修訂意見</Link>
          </div>
        </div>
      </footer>
      <MobileNavigation />
    </div>
  );
}

export function HeroPanel({
  eyebrow,
  title,
  body,
  imageKey,
  actions,
}: {
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly body: string;
  readonly imageKey: EvidenceVisualVariant;
  readonly actions?: ReactNode | undefined;
}) {
  return (
    <section className="research-panel section-cover overflow-hidden">
      <div className="grid min-w-0 gap-5 p-5 lg:grid-cols-[1.05fr_0.95fr] lg:p-6">
        <div className="flex min-w-0 flex-col justify-center gap-4">
          <div className="space-y-3">
            <h1 className="hero-title max-w-[18ch] text-4xl font-black leading-[1.05] tracking-normal text-[var(--ink)] md:text-5xl">{title}</h1>
            <p className="hero-copy max-w-[64ch] text-base leading-7 text-[var(--muted)]">{body}</p>
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
        <EvidenceVisual variant={imageKey} />
      </div>
    </section>
  );
}

export function Section({
  id,
  title,
  body,
  children,
  className,
}: {
  readonly id?: string | undefined;
  readonly title: string;
  readonly body?: string | undefined;
  readonly children: ReactNode;
  readonly className?: string | undefined;
}) {
  return (
    <section id={id} className={cn("lab-section scroll-mt-44 md:scroll-mt-24", className)}>
      <div className="lab-section__heading">
        <h2 className="text-xl font-bold text-[var(--ink)] md:text-2xl">{title}</h2>
        {body ? <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function PrimaryLink({
  href,
  children,
  variant = "default",
}: {
  readonly href: string;
  readonly children: ReactNode;
  readonly variant?: "default" | "secondary" | "warning" | "ghost";
}) {
  return (
    <Button asChild variant={variant} className={`site-action site-action--${variant}`}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}

const policyLinks = [
  { href: "/trust", label: "信任中心" },
  { href: "/editorial-policy", label: "編輯政策" },
  { href: "/ai-disclosure", label: "AI 使用披露" },
  { href: "/conflicts", label: "利益衝突政策" },
  { href: "/privacy", label: "私隱與本機資料" },
] as const;

const methodLinks = [
  { href: "/methodology/data", label: "數據方法" },
  { href: "/methodology/backtesting", label: "回測方法" },
  { href: "/corrections", label: "修訂紀錄" },
  { href: "/risk-disclosure", label: "風險披露" },
] as const;

function FooterGroup({
  title,
  links,
}: {
  readonly title: string;
  readonly links: readonly { readonly href: string; readonly label: string }[];
}) {
  return (
    <div>
      <strong>{title}</strong>
      <ul>
        {links.map((item) => (
          <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
