"use client";
import { useEffect, useState } from "react";
import { positionSize, recoveryPercent } from "@/lib/risk-math";
import type { PositionInputs } from "@/lib/risk-math";
const money = (n:number) => n.toLocaleString("zh-HK",{minimumFractionDigits:2, maximumFractionDigits:2});
export function RiskCalculator() {
  const [values,setValues] = useState<Record<keyof PositionInputs,string>>({capital:"100000",riskPercent:"1",entry:"100",stop:"95",target:"110",lot:"100",fees:"100",slippage:"0.2"});
  const result = positionSize(Object.fromEntries(Object.entries(values).map(([k,v])=>[k,v.trim() === "" ? NaN : Number(v)])) as PositionInputs);
  const [drawdown,setDrawdown]=useState("20");
  const recovery=drawdown.trim() === "" ? null : recoveryPercent(Number(drawdown));
  const fields: [keyof PositionInputs,string,string][] = [["capital","可用資金（港元）","1"],["riskPercent","單筆風險預算（%）","0.1"],["entry","買入價（港元）","0.01"],["stop","止蝕參考價（港元）","0.01"],["target","目標參考價（港元）","0.01"],["lot","每手股數","1"],["fees","估計來回費用（港元）","1"],["slippage","來回滑價預留（每股港元）","0.01"]];
  return <div><div className="calculator-grid"><div className="tool-fields">{fields.map(([key,label,step])=><label key={key} htmlFor={key}>{label}<input id={key} type="number" min="0" step={step} value={values[key]} onChange={e=>setValues({...values,[key]:e.target.value})}/></label>)}</div><div className="calculation-result" aria-live="polite">{result ? <><h3>按輸入條件計算</h3><strong>{result.shares.toLocaleString("zh-HK")} 股</strong><p>{result.lots} 手 · 持倉金額 HK$ {money(result.amount)}</p><dl><div><dt>風險預算</dt><dd>HK$ {money(result.budget)}</dd></div><div><dt>計劃虧損連預留成本</dt><dd>HK$ {money(result.loss)}</dd></div><div><dt>目標淨收益算例</dt><dd>HK$ {money(result.profit)}</dd></div><div><dt>淨回報／風險</dt><dd>{result.ratio === null ? "不適用" : result.ratio.toFixed(2) + " 倍"}</dd></div></dl>{result.shares === 0 ? <p>現有預算不足一手；可修改輸入重新計算。</p> : null}</> : <p role="alert">請輸入有效數字：止蝕價須低於買入價、目標價須高於買入價；每手股數為正整數，風險比例介乎 0 至 100%。</p>}</div></div><p className="tool-caption">適用於不借貸的現金買入算例。股數同時受風險預算和可用資金限制，並向下取整至一手。費用為自行填寫的來回總額，並非券商報價。裂口或流動性不足可令實際虧損超出計劃。</p><details className="formula-explanation"><summary>查看計算方法</summary><p>可承受股數 =（風險預算 − 來回費用）÷（買入價 − 止蝕價 + 每股來回滑價）。再與現金可買股數比較，採用較低者並向下取整至一手。</p><p>目標淨收益 = 股數 ×（目標價 − 買入價 − 每股來回滑價）− 來回費用。</p></details><div className="drawdown-tool"><h3>回撤後，需要升多少才回到原點？</h3><label htmlFor="drawdown">回撤幅度（%）<input id="drawdown" type="number" min="0" max="99.99" step="1" value={drawdown} onChange={e=>setDrawdown(e.target.value)}/></label><output>{recovery === null ? "請輸入 0 至低於 100 的數字。" : `回到原值需要上升 ${money(recovery)}%`}</output><p>算式：回撤幅度 ÷（100 − 回撤幅度）× 100。20% 的回撤，需要 25% 的升幅修復。</p></div></div>;
}
function download(name:string,text:string) {
  const url=URL.createObjectURL(new Blob([text],{type:"text/plain;charset=utf-8"}));
  const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
}
const journalFields=[["date","日期與時段"],["symbol","證券與週期"],["thesis","觀察與入市理由"],["invalidation","失效條件與止蝕"],["size","股數、風險金額及成本"],["execution","實際成交與計劃偏差"],["review","結果、檢討及下一步"]] as const;
export function JournalTool() {
  const [data,setData]=useState<Record<string,string>>({});
  const [status,setStatus]=useState("");
  useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem("hkel-journal-v1")??"{}");if(saved&&typeof saved==="object")setData(Object.fromEntries(journalFields.map(([k])=>[k,typeof saved[k]==="string"?saved[k]:""])));}catch{setStatus("未能讀取本機紀錄。你仍可填寫並下載。");}},[]);
  return <div><div className="journal-fields">{journalFields.map(([key,label])=><label key={key} htmlFor={`journal-${key}`}>{label}<textarea id={`journal-${key}`} rows={key==="thesis"||key==="review"?4:2} value={data[key]??""} onChange={e=>setData({...data,[key]:e.target.value})}/></label>)}</div><div className="tool-actions"><button className="plain-button" onClick={()=>{try{localStorage.setItem("hkel-journal-v1",JSON.stringify(data));setStatus("已儲存在這個瀏覽器。");}catch{setStatus("瀏覽器未能儲存；請下載文字檔保留紀錄。");}}}>儲存本機紀錄</button><button className="plain-button secondary" onClick={()=>download("交易日誌.txt",journalFields.map(([k,l])=>l+"\n"+(data[k]??"")).join("\n\n"))}>下載文字檔</button></div><p role="status">{status}</p><p className="tool-caption">紀錄只存於這個瀏覽器，不會送交網站。清除瀏覽器資料後便會移除，請以下載檔案保留副本。</p></div>;
}
const questions=[
 {q:"RSI 已在 70 以上，但價格仍逐步創新高。哪個理解較合理？",options:["指標保證下一根下跌","動能偏強，須配合價格結構判讀","立即反向交易"],answer:1,why:"RSI 高位描述近期升幅相對跌幅的比例。趨勢可以延續，高讀數本身沒有確認反轉。"},
 {q:"股價由 100 升至 110，同時 ATR 上升。ATR 直接反映甚麼？",options:["上升趨勢必定延續","成交量增加","價格波動幅度擴大"],answer:2,why:"ATR 量度真實波幅，包含前收市至本期高低價的距離；方向須另看價格。"},
 {q:"回測在一根日線內同時碰到止賺和止蝕，單憑日線能知道甚麼？",options:["不能確定兩者的真實先後次序","一定先止賺","一定先止蝕"],answer:0,why:"日線 OHLC 不記錄完整盤中路徑。回測使用的成交模型會影響結果；較細週期資料可以補充，但仍有資料精度限制。"},
 {q:"兩個資產都下跌 10 元，一個原價 50 元，另一個原價 200 元。跌幅比例如何？",options:["兩者相同","分別為 20% 和 5%","分別為 5% 和 20%"],answer:1,why:"比較風險時要對齊單位。金額相同的變動，對不同價格的資產代表不同百分比。"},
 {q:"止蝕參考價是 95 元，下一日直接以 90 元開市。計算上應怎樣處理？",options:["一律當成 95 元成交","刪除這筆交易","按可成交價格及訂單機制處理"],answer:2,why:"止蝕觸發與成交是兩回事。市場裂口跳過指定價位時，計劃虧損不等於最終虧損。"},
];
export function PracticeQuiz() {
 const [answers,setAnswers]=useState<Record<number,number>>({});
 return <div className="quiz-list">{questions.map((q,i)=><fieldset key={q.q}><legend>{i+1}. {q.q}</legend><div>{q.options.map((option,j)=><label key={option}><input type="radio" name={`question-${i}`} checked={answers[i]===j} onChange={()=>setAnswers({...answers,[i]:j})}/>{option}</label>)}</div>{answers[i]!==undefined?<p role="status"><strong>{answers[i]===q.answer?"判讀正確。":"再想一想。"}</strong>{q.why}</p>:null}</fieldset>)}<p className="result-count">已完成 {Object.keys(answers).length} / {questions.length} 題</p></div>;
}
export function PreparationChecklist() {
 const labels=["能說明所用資料的市場、時區和復權方法","能把入市與退出條件寫成沒有歧義的句子","已分清指標事件、警報與實際訂單","已把每手股數、費用及滑價放進計算","已選定未用於調參的歷史期間","已準備記錄每次測試的設定和結果"];
 const [checked,setChecked]=useState<number[]>([]);
 return <div className="prep-list">{labels.map((label,i)=><label key={label}><input type="checkbox" checked={checked.includes(i)} onChange={e=>setChecked(e.target.checked?[...checked,i]:checked.filter(n=>n!==i))}/>{label}</label>)}<output>已完成 {checked.length} / {labels.length} 項</output></div>;
}
export function CorrectionNote() {
 const [page,setPage]=useState("");const [note,setNote]=useState("");
 return <div className="tool-fields"><label htmlFor="correction-page">文章網址或名稱<input id="correction-page" value={page} onChange={e=>setPage(e.target.value)}/></label><label htmlFor="correction-note">問題位置、修正理由與參考來源<textarea id="correction-note" rows={7} value={note} onChange={e=>setNote(e.target.value)}/></label><button className="plain-button" disabled={!page.trim()||!note.trim()} onClick={()=>download("內容修訂筆記.txt","頁面："+page+"\n\n"+note)}>下載修訂筆記</button><p className="tool-caption">這項工具在瀏覽器內產生檔案，供你保存或自行轉交；不會傳送內容或建立網上紀錄。</p></div>;
}
