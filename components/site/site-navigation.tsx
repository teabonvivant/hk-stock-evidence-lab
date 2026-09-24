"use client";
import Link from "@/components/site/site-link";
import { usePathname } from "next/navigation";
import { FileText, LibraryBig, Home, Menu } from "lucide-react";
const groups = [
 { title: "學習與查找", links: [["/candlesticks","認識陰陽燭"],["/glossary","查閱詞彙"],["/compare","比較指標"],["/combo","檢視指標組合"],["/trial","自學清單"]] },
 { title: "案例與練習", links: [["/toolbox","計算風險"],["/casebook","查看歷史圖表"],["/strategy-cases","研究策略方法"],["/tv-strategies","學習回測"],["/playground","練習判讀"],["/journal","使用交易日誌"],["/script","閱讀 Pine Script 教學"]] },
 { title: "本站方法", links: [["/trust","了解內容與方法"],["/methodology/data","查看數據方法"],["/editorial-policy","閱讀編輯原則"],["/subscribe","文章更新與 RSS"],["/sitemap","瀏覽全部頁面"]] },
];
function isCurrentPath(pathname: string, href: string) {
 return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
export function SiteNavigation() {
 const pathname = usePathname();
 const links = [["/learn","開始學習"],["/indicators","查找指標"],["/blog","閱讀研究"],["/toolbox","練習與工具"],["/trust","本站方法"]];
 return <><nav aria-label="主要導覽" className="site-nav">{links.map(([href,label]) => <Link href={href!} key={href} aria-current={isCurrentPath(pathname, href!) ? "page" : undefined}>{label}</Link>)}</nav><details className="all-navigation"><summary aria-label="網站導覽選單"><Menu size={21} aria-hidden="true" /><span>全部內容</span></summary><nav aria-label="所有分頁" className="navigation-panel">{groups.map(group => <div key={group.title}><strong>{group.title}</strong>{group.links.map(([href,label]) => <Link key={href} href={href!} aria-current={isCurrentPath(pathname, href!) ? "page" : undefined} onClick={e => { e.currentTarget.closest("details")?.removeAttribute("open"); }}>{label}</Link>)}</div>)}</nav></details></>;
}
export function MobileNavigation() {
 const pathname = usePathname();
 const items = [{href:"/",label:"首頁",Icon:Home},{href:"/indicators",label:"查找",Icon:LibraryBig},{href:"/blog",label:"閱讀",Icon:FileText},{href:"/sitemap",label:"更多",Icon:Menu}];
 return <nav aria-label="流動版主要導覽" className="mobile-nav">{items.map(({href,label,Icon}) => <Link key={href} href={href} aria-current={(href === "/" ? pathname === "/" : pathname.startsWith(href)) ? "page" : undefined}><Icon aria-hidden="true" /><span>{label}</span></Link>)}</nav>;
}
