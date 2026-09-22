export type EvidenceVisualVariant = "home" | "indicators" | "detail" | "compare" | "playground" | "glossary" | "journal" | "combo" | "subscribe" | "tv";
const content: Record<EvidenceVisualVariant, { title: string; steps: [string,string][] }> = {
 home: { title: "從觀察走向理解", steps: [["價格位置", "高低點、區域、突破"], ["成交參與", "成交股數與價格變化"], ["風險距離", "止蝕、股數、成本"], ["留下紀錄", "把判斷放回當時的資料"]] },
 indicators: { title: "五種問題，五種工具", steps: [["方向", "均線與價格結構"], ["動能", "RSI、MACD"], ["成交", "成交量、OBV"], ["波幅", "ATR、通道"], ["位置", "支持阻力、前期高低"]] },
 detail: { title: "一根燭的四個座標", steps: [["開市價", "這段時間的第一筆價格"], ["最高與最低", "這段時間的活動範圍"], ["收市價", "時段完結的位置"], ["實體與影線", "起終點與途中走過的距離"]] },
 compare: { title: "相同價格，不同問題", steps: [["SMA / EMA", "平均價格與權重"], ["RSI / Stochastic", "升跌比例與區間位置"], ["ATR / ADX", "波動幅度與趨勢強度"], ["OBV / VWAP", "累積成交方向與加權價格"]] },
 playground: { title: "把條件改一改", steps: [["趨勢", "訊號延遲與延續"], ["橫行", "邊界與來回穿越"], ["裂口", "預設價格與實際成交"], ["反轉", "動能變化與結構確認"]] },
 glossary: { title: "讀數之前，對齊定義", steps: [["價格", "收市、復權、裂口"], ["交易", "價差、限價、滑價"], ["風險", "倉位、回撤、R 值"], ["研究", "樣本外、重繪、過度擬合"]] },
 journal: { title: "一筆交易的完整紀錄", steps: [["決定之前", "條件、入市價、失效位置"], ["執行當下", "時間、股數、實際成交"], ["持倉期間", "計劃改動及其原因"], ["結束之後", "成本、結果、流程偏差"]] },
 combo: { title: "讓工具各司其職", steps: [["市況篩選", "是否符合這套方法的前提"], ["訊號觸發", "以可觀察條件定義事件"], ["風險預算", "按距離與成本計算股數"], ["退出安排", "失效、目標與時間限制"]] },
 subscribe: { title: "持續閱讀的路徑", steps: [["研究札記", "按主題尋找文章"], ["指標百科", "核對公式與使用範圍"], ["更新紀錄", "查閱內容修訂"], ["RSS", "以閱讀器追蹤文章"]] },
 tv: { title: "一次回測的時間線", steps: [["鎖定規則", "資料、參數、入市與退出"], ["逐根計算", "只用當時可以取得的資料"], ["模擬成交", "價差、滑價、費用"], ["檢視結果", "交易明細、回撤、樣本外"]] },
};
export function EvidenceVisual({ variant }: { readonly variant: EvidenceVisualVariant }) {
 const item = content[variant];
 return <figure className="evidence-visual"><figcaption><strong>{item.title}</strong></figcaption><ol>{item.steps.map(([title,detail],i) => <li key={title}><span aria-hidden="true">{i+1}</span><div><strong>{title}</strong><small>{detail}</small></div></li>)}</ol></figure>;
}
