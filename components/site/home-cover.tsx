import { ArrowUpRight } from "lucide-react";
import { PrimaryLink } from "@/components/site/page-shell";

export function HomeCover() {
  return <section className="cover-hero">
    <div className="cover-hero__copy">
      <h1><span>讀懂價格，</span><span>也讀懂它的分寸。</span></h1>
      <p>一條線，一次突破，一份漂亮的回測，都值得多問一句。從圖表、公式到市場機制，整理可以查證的知識，讓每個判斷都有來處。</p>
      <div className="cover-actions"><PrimaryLink href="/blog">閱讀研究札記<ArrowUpRight size={19} aria-hidden="true" /></PrimaryLink><PrimaryLink href="/learn" variant="secondary">從基礎開始</PrimaryLink></div>
    </div>
    <div className="cover-hero__art"><img src="/art/architecture-cover-v2.webp" alt="" aria-hidden="true" width="1122" height="1402" fetchPriority="high" /></div>
  </section>;
}
