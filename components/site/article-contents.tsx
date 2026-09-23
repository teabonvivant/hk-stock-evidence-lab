"use client";
import { useEffect, useState } from "react";
import Link from "@/components/site/site-link";
import { ChevronDown } from "lucide-react";

export function ArticleContents({ sections }: { sections: string[] }) {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1000px)");
    const update = () => setExpanded(desktop.matches);
    update();
    desktop.addEventListener("change", update);
    return () => desktop.removeEventListener("change", update);
  }, []);
  return <aside className="article-toc">
    <button type="button" aria-expanded={expanded} aria-controls="article-contents" onClick={() => setExpanded(!expanded)}>本篇目錄<ChevronDown size={18} aria-hidden="true" /></button>
    <div id="article-contents" hidden={!expanded}><ol>{sections.map((heading, i) => <li key={heading}><a href={`#section-${i + 1}`}>{heading}</a></li>)}</ol><Link href="/blog">全部研究札記 →</Link></div>
  </aside>;
}
