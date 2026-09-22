"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LibraryBig, Gauge, Home, Menu } from "lucide-react";
const groups = [
 { title: "學習與閱讀", links: [["/learn","學習路線"],["/blog","研究札記"],["/indicators","指標百科"],["/candlesticks","陰陽燭"],["/glossary","詞彙表"]] },
 { title: "方法與實踐", links: [["/compare","指標比較"],["/combo","指標組合"],["/casebook","歷史圖表"],["/strategy-cases","策略方法"],["/tv-strategies","回測教學"]] },
 { title: "研究工具", links: [["/toolbox","風險計算"],["/playground","判讀練習"],["/journal","交易日誌"],["/script","Pine Script"],["/trial","自學清單"]] },
 { title: "關於本站", links: [["/trust","關於與方法"],["/subscribe","內容更新"],["/methodology/data","數據方法"],["/editorial-policy","編輯原則"],["/sitemap","網站導覽"]] },
];
export function SiteNavigation() {
 const pathname = usePathname();
 const links = [["/learn","學習"],["/indicators","指標百科"],["/blog","研究札記"],["/strategy-cases","策略方法"],["/toolbox","工具"],["/trust","關於"]];
 return <><nav aria-label="主要導覽" className="site-nav">{links.map(([href,label]) => <Link href={href!} key={href} aria-current={pathname.startsWith(href!) ? "page" : undefined}>{label}</Link>)}</nav><details className="all-navigation"><summary aria-label="開啟所有分頁"><Menu size={21} /><span>選單</span></summary><nav aria-label="所有分頁" className="navigation-panel">{groups.map(group => <div key={group.title}><strong>{group.title}</strong>{group.links.map(([href,label]) => <Link key={href} href={href!} onClick={e => { e.currentTarget.closest("details")?.removeAttribute("open"); }}>{label}</Link>)}</div>)}</nav></details></>;
}
export function MobileNavigation() {
 const pathname = usePathname();
 const items = [{href:"/",label:"首頁",Icon:Home},{href:"/blog",label:"札記",Icon:BookOpen},{href:"/indicators",label:"指標",Icon:LibraryBig},{href:"/toolbox",label:"工具",Icon:Gauge},{href:"/sitemap",label:"導覽",Icon:Menu}];
 return <nav aria-label="流動版主要導覽" className="mobile-nav">{items.map(({href,label,Icon}) => <Link key={href} href={href} aria-current={(href === "/" ? pathname === "/" : pathname.startsWith(href)) ? "page" : undefined}><Icon aria-hidden="true" /><span>{label}</span></Link>)}</nav>;
}
