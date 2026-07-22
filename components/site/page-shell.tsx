import Image from "next/image";
import Link from "next/link";
import { Activity, BookOpen, Code2, FlaskConical, LineChart, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "總覽", icon: Activity },
  { href: "/indicators", label: "指標庫", icon: LineChart },
  { href: "/strategy-cases", label: "策略案例", icon: FlaskConical },
  { href: "/tv-strategies", label: "回測教學", icon: ShieldCheck },
  { href: "/script", label: "Pine Script", icon: Code2 },
  { href: "/glossary", label: "詞彙表", icon: BookOpen },
];

const visualMap = {
  home: "/generated-pages/home.png",
  indicators: "/generated-pages/indicators.png",
  detail: "/generated-pages/indicator-detail.png",
  compare: "/generated-pages/compare.png",
  playground: "/generated-pages/playground.png",
  glossary: "/generated-pages/glossary.png",
  journal: "/generated-pages/journal.png",
  combo: "/generated-pages/combo.png",
  subscribe: "/generated-pages/subscribe.png",
  tv: "/generated-pages/tv-strategies.png",
} satisfies Record<string, string>;

export function PageShell({ children }: { readonly children: ReactNode }) {
  return (
    <div className="app-shell">
      <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[8px] focus:bg-white focus:px-4 focus:py-2 focus:text-[var(--ink)]" href="#main">
        跳到主要內容
      </a>
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgb(245_247_251/0.88)] backdrop-blur">
        <div className="page-wrap flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
          <Link href="/" className="flex items-center gap-3 font-bold text-[var(--ink)]">
            <span className="grid size-9 place-items-center rounded-[8px] bg-[var(--primary)] text-sm text-white">TI</span>
            <span>技術指標研究室</span>
          </Link>
          <nav aria-label="主要導覽" className="flex flex-wrap items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="pressable inline-flex min-h-10 items-center gap-2 rounded-[8px] px-3 text-sm font-semibold text-[var(--muted)] hover:bg-white hover:text-[var(--primary-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main id="main" className="page-wrap py-6 md:py-8">
        {children}
      </main>
      <footer className="page-wrap pb-8 pt-3 text-sm text-[var(--muted)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-5">
          <span>本站內容只作教育及研究用途，不構成投資建議。</span>
          <span>資料版本：2026-07-05；本地策略設定及 Pine Script 範本已整理。</span>
        </div>
      </footer>
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
  readonly title: string;
  readonly body: string;
  readonly imageKey: keyof typeof visualMap;
  readonly actions?: ReactNode | undefined;
}) {
  return (
    <section className="research-panel overflow-hidden">
      <div className="grid min-w-0 gap-5 p-5 lg:grid-cols-[1.05fr_0.95fr] lg:p-6">
        <div className="flex min-w-0 flex-col justify-center gap-4">
          <Badge variant="info" className="w-fit">
            {eyebrow}
          </Badge>
          <div className="space-y-3">
            <h1 className="hero-title max-w-[13ch] text-4xl font-black leading-[1.05] tracking-normal text-[var(--ink)] md:text-5xl">{title}</h1>
            <p className="hero-copy max-w-[64ch] text-base leading-7 text-[var(--muted)]">{body}</p>
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
        <div className="relative min-h-64 w-full min-w-0 max-w-full overflow-hidden rounded-[8px] border border-[var(--line)] bg-[var(--surface-soft)]">
          <Image
            src={visualMap[imageKey]}
            alt=""
            fill
            priority
            unoptimized
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 520px"
          />
        </div>
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
    <section id={id} className={cn("mt-5 scroll-mt-44 rounded-[8px] border border-[var(--line)] bg-white/90 p-5 shadow-[0_10px_28px_rgba(15,35,55,0.05)] md:scroll-mt-24", className)}>
      <div className="mb-4 max-w-[68ch]">
        <h2 className="text-2xl font-bold text-[var(--ink)]">{title}</h2>
        {body ? <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function MetricTile({
  label,
  value,
  tone = "info",
}: {
  readonly label: string;
  readonly value: string | number;
  readonly tone?: "info" | "good" | "warn" | "bad";
}) {
  return (
    <div className="metric-tile">
      <Badge variant={tone}>{label}</Badge>
      <strong className="mt-3 block text-3xl font-black leading-none text-[var(--ink)]">{value}</strong>
    </div>
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
    <Button asChild variant={variant}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
