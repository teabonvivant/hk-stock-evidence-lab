import { readFile, writeFile, mkdir } from "node:fs/promises";
import { buildSync } from "esbuild";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const require = createRequire(import.meta.url);
const json = async name => JSON.parse((await readFile(path.join(root,name),"utf8")).replace(/^\uFEFF/,""));
const articles = await json("data/site/blog-articles.json");
const core = await json("data/site/core_indicator_learning.json");
const coreSlugs = new Set(core.items.map(i=>i.slug));
if(articles.length !== 100) throw Error("Publication requires exactly 100 complete articles.");
const unique = new Set();
const report = {articles:0,blogFigures:0,indicatorFigures:0,characters:0,minCharacters:Infinity,maxCharacters:0,categories:{},sources:new Set()};
const pilotSlugs = new Set(["support-resistance-zones","rsi-in-strong-trends","hong-kong-trading-day","position-size-stop-distance"]);
for (const a of articles) {
  const length = (a.intro+a.sections.flatMap(s=>s.paragraphs).join("")).match(/\p{Script=Han}/gu)?.length ?? 0;
  if(unique.has(a.slug)||!a.slug||a.figures.length!==2||a.sections.length<4||length<750||a.sources.length<1) throw Error("Invalid article: "+a.id+" ("+length+" characters)");
  unique.add(a.slug);
  report.articles++; report.characters+=length;report.minCharacters=Math.min(report.minCharacters,length);report.maxCharacters=Math.max(report.maxCharacters,length);
  report.categories[a.category]=(report.categories[a.category]??0)+1;
  for(const s of a.sources) {new URL(s.url);report.sources.add(s.url);}
  for(const [i,f] of a.figures.entries()) {
    if(f.items.length<3||f.items.length>5||!["flow","bars","comparison"].includes(f.kind))throw Error("Invalid diagram "+a.id);
    if(f.kind==="bars"&&f.items.some(i=>!Number.isFinite(i.value)))throw Error("Unquantified bar: "+a.id);
    await save("public/illustrations/blog/"+a.slug+"-"+(i+1)+".svg",pilotSlugs.has(a.slug)?pilotDiagram(a.slug,i):diagram(f));
    report.blogFigures++;
  }
  if(pilotSlugs.has(a.slug)) await save("public/illustrations/covers/"+a.slug+".svg",cover(a.slug,a.title));
}

const guideEntry = 'import {indicators} from "./lib/site-data"; import {beginnerGuideFor} from "./lib/indicator-beginner-guide"; export default indicators.map(i=>({slug:i.siteSlug,name:i.nameZh,guide:beginnerGuideFor(i)}));';
const bundle = buildSync({stdin:{contents:guideEntry,resolveDir:root,loader:"ts"},bundle:true,platform:"node",format:"cjs",write:false,tsconfig:path.join(root,"tsconfig.json")}).outputFiles[0].text;
await save(".content-cache/guides.cjs",bundle);
const guides=require(path.join(root,".content-cache/guides.cjs")).default;
for(const {slug,name,guide} of guides) {
  if(coreSlugs.has(slug))continue;
  const spec={kind:"flow",title:name+"：判讀次序",caption:guide.flowLead,items:guide.flow.map(s=>({label:s.title,detail:s.body}))};
  await save("public/illustrations/indicators/"+slug+".svg",diagram(spec,true));
  report.indicatorFigures++;
}
const origin="https://technical-indicators-hk.teabonvivant.chatgpt.site";
const items=articles.map(a=>"<item><title>"+xml(a.title)+"</title><link>"+origin+"/blog/"+a.slug+"</link><guid isPermaLink=\"true\">"+origin+"/blog/"+a.slug+"</guid><description>"+xml(a.excerpt)+"</description><category>"+xml(a.category)+"</category><pubDate>Tue, 22 Sep 2026 00:00:00 +0800</pubDate></item>").join("\n");
await save("public/feed.xml",'<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>港股證據研究室｜研究札記</title><link>'+origin+'/blog</link><description>市場、圖表、風險與研究方法。</description><language>zh-HK</language><atom:link href="'+origin+'/feed.xml" rel="self" type="application/rss+xml"/>'+items+'</channel></rss>\n');
report.sources=report.sources.size;
await save(".content-cache/content-report.json",JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));

async function save(name,content){const dest=path.join(root,name);await mkdir(path.dirname(dest),{recursive:true});await writeFile(dest,content,"utf8");}
function xml(s){return String(s).replace(/[<>&"']/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&apos;"}[c]));}
function lines(s,capacity){let result=[],line="",width=0;for(const c of s){const w=/[\u0020-\u007e]/.test(c)?0.55:1;if(width+w>capacity){result.push(line);line="";width=0;}line+=c;width+=w;}if(line)result.push(line);return result;}
function text(s,x,y,size,width,color="#0b1f33",weight=400,leading=size*1.35){return '<text x="'+x+'" y="'+y+'" font-size="'+size+'" font-weight="'+weight+'" fill="'+color+'">'+lines(s,width).map((l,i)=>'<tspan x="'+x+'" dy="'+(i===0?0:leading)+'">'+xml(l)+'</tspan>').join("")+'</text>';}
function diagram(f,long=false){
  const n=f.items.length;
  const tall=long?800:640;
  const top=long?160:158, area=long?552:404;
  let s='<svg xmlns="http://www.w3.org/2000/svg" width="720" height="'+tall+'" viewBox="0 0 720 '+tall+'" role="img" aria-labelledby="title desc"><title id="title">'+xml(f.title)+'</title><desc id="desc">'+xml(f.items.map(i=>i.label+"："+i.detail+(i.value!==undefined?"，數值 "+i.value:"")).join("；"))+'</desc><rect width="720" height="'+tall+'" fill="#f4f7f7"/><g font-family="Microsoft JhengHei,PingFang HK,Noto Sans HK,sans-serif">';
  s+=text(f.title,40,90,29,22,"#0b1f33",700,38);
  if(f.kind==="flow"){
    const row=area/n;
    f.items.forEach((item,i)=>{
      const y=top+i*row, h=row-14;
      if(i<n-1)s+='<path d="M67 '+(y+h)+'v14m-4-5 4 5 4-5" stroke="#0f766e" stroke-width="2" fill="none"/>';
      s+='<rect x="40" y="'+y+'" width="640" height="'+h+'" rx="7" fill="#ffffff" stroke="#d5e2e0"/><circle cx="68" cy="'+(y+29)+'" r="15" fill="#0f766e"/>';
      s+=text(String(i+1),63,y+35,17,2,"#fff",700);
      s+=text(item.label,98,y+29,23,25,"#0b1f33",700);
      const font=long?20:(n===5?18:21);
      s+=text(item.detail,98,y+58,font,Math.floor(552/font),"#334155",400,font*1.3);
    });
  } else if(f.kind==="comparison"){
    if(n===5){
      const row=area/n;
      f.items.forEach((item,i)=>{
        const y=top+i*row;
        s+='<rect x="40" y="'+y+'" width="640" height="'+(row-10)+'" rx="7" fill="#ffffff" stroke="#d5e2e0"/><path d="M282 '+(y+12)+'v'+(row-34)+'" stroke="#c7dbd8"/>';
        s+=text(item.label,58,y+28,20,10,"#0b1f33",700,25);
        s+=text(item.detail,304,y+28,19,18,"#334155",400,25);
      });
    } else {
    const rows=Math.ceil(n/2), gap=18, height=(area-gap*(rows-1))/rows;
    f.items.forEach((item,i)=>{
      const lastFull=n%2===1 && i===n-1;
      const x=40+(i%2)*329,y=top+Math.floor(i/2)*(height+gap),w=lastFull?640:311;
      s+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+height+'" rx="7" fill="#ffffff" stroke="#d5e2e0"/><path d="M'+(x+18)+' '+(y+19)+'h30" stroke="#0f766e" stroke-width="3"/>';
      s+=text(item.label,x+18,y+51,23,Math.floor((w-36)/23),"#0b1f33",700);
      const labelLines=lines(item.label,Math.floor((w-36)/23)).length;
      s+=text(item.detail,x+18,y+51+labelLines*29+8,20,Math.floor((w-36)/20),"#334155",400,27);
    });
    }
  } else {
    const vals=f.items.map(i=>i.value),lo=Math.min(0,...vals),hi=Math.max(0,...vals),span=hi-lo||1;
    const axisMin=320,axisMax=628,axis=v=>axisMin+(v-lo)/span*(axisMax-axisMin),zero=axis(0),row=area/n;
    s+='<path d="M'+zero+' '+(top-2)+'V'+(top+area)+'" stroke="#a8b9b8" stroke-dasharray="3 5"/>';
    f.items.forEach((item,i)=>{
      const y=top+i*row, x=axis(item.value);
      s+=text(item.label,40,y+21,21,13,"#0b1f33",700);
      s+=text(item.detail,40,y+49,17,15,"#334155",400,22);
      s+='<rect x="'+Math.min(x,zero)+'" y="'+(y+29)+'" width="'+Math.abs(x-zero)+'" height="25" rx="2" fill="'+(item.value<0?"#b45309":"#0f766e")+'"/>';
      if(item.value===0)s+='<circle cx="'+zero+'" cy="'+(y+41.5)+'" r="3" fill="#0f766e"/>';
      s+=text(String(item.value),320,y+18,19,20,"#0b1f33",700);
    });
    s+=text("數值按同一比例繪製；單位及假設見圖說。",40,584,15,42,"#52636b");
  }
  s+='<path d="M40 '+(tall-35)+'H680" stroke="#d5e2e0"/>';
  s+=text("港股證據研究室",40,tall-13,14,28,"#52636b");
  return s+"</g></svg>\n";
}

// Hand-authored, deterministic diagrams for the four editorial pilot articles.
// Their shapes, labels and plotted values come directly from each article's teaching text.
function pilotDiagram(slug,index){
  const body=slug+"|"+index;
  const description=slug==="hong-kong-trading-day"?(index===0?"香港時間的一般全日市交易時段示意；適用證券及當日安排須按香港交易所資料核對。":"休市、重開與券商委託狀態的流程示意；各券商介面及處理時間可能不同。"):`教學圖解，數值取自文章中的假設算例，不代表實際市場行情。`;
  const head=`<svg xmlns="http://www.w3.org/2000/svg" width="720" height="480" viewBox="0 0 720 480" role="img" aria-labelledby="t d"><title id="t">${pilotTitle(slug,index)}</title><desc id="d">${description}</desc><rect width="720" height="480" fill="#f5f7f9"/><g font-family="Microsoft JhengHei,PingFang HK,Noto Sans HK,sans-serif" fill="#142536">`;
  const footer=slug==="hong-kong-trading-day"?(index===0?"港股證據研究室　·　香港時間，以港交所公布安排為準":"港股證據研究室　·　委託流程示意，以券商實際狀態為準"):"港股證據研究室　·　教學示意，非實際行情";
  const foot=`<text x="40" y="452" font-size="14" fill="#506174">${footer}</text></g></svg>\n`;
  const title=(s,x=40,y=46,size=24,weight=700,color="#142536")=>`<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${color}">${s}</text>`;
  const line=(x1,y1,x2,y2,color="#a9b8c7",w=1,d="")=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${color}" stroke-width="${w}" ${d}/>`;
  let s=head;
  if(slug==="support-resistance-zones"&&index===0){
    s+=title("同一支持區，三種收市結果")+title("假設價格（元）",40,77,15,500,"#506174");
    const rows=[{y:120,label:"留在區內",pts:"100,163 178,142 250,169 328,139 408,155 500,132 610,147",end:"10.0"},{y:232,label:"盤中試穿後收回",pts:"100,267 185,246 267,271 350,291 421,249 520,233 610,250",end:"10.0"},{y:344,label:"收市低於下緣",pts:"100,372 187,349 268,375 348,394 440,373 526,404 610,416",end:"9.6"}];
    for(const r of rows){s+=title(r.label,40,r.y,17,650);s+=`<rect x="90" y="${r.y+13}" width="555" height="28" fill="#dcebf1"/><line x1="90" y1="${r.y+13}" x2="645" y2="${r.y+13}" stroke="#285f96" stroke-dasharray="5 4"/><line x1="90" y1="${r.y+41}" x2="645" y2="${r.y+41}" stroke="#285f96" stroke-dasharray="5 4"/><text x="650" y="${r.y+18}" font-size="13" fill="#506174">10.1</text><text x="650" y="${r.y+43}" font-size="13" fill="#506174">9.8</text><polyline points="${r.pts}" fill="none" stroke="#185bd1" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="610" cy="${r.y===120?147:r.y===232?250:416}" r="5" fill="#142536"/><text x="574" y="${r.y+66}" font-size="14" font-weight="700">收 ${r.end}</text>`;}
  } else if(slug==="support-resistance-zones"){
    s+=title("盤中低位與收市位置，回答不同問題")+title("同一假設下緣：9.8 元",40,79,16,500,"#506174");
    s+=`<line x1="90" y1="155" x2="640" y2="155" stroke="#285f96" stroke-width="2" stroke-dasharray="7 5"/><text x="92" y="143" font-size="15" fill="#285f96">區域下緣 9.8</text><line x1="120" y1="320" x2="620" y2="320" stroke="#dce4ea"/><text x="120" y="350" font-size="17">盤中低位：9.7</text><circle cx="310" cy="155" r="9" fill="#fff" stroke="#b45309" stroke-width="3"/><path d="M310 164V250" stroke="#b45309" stroke-width="2"/><circle cx="310" cy="250" r="8" fill="#185bd1"/><text x="340" y="246" font-size="17" font-weight="700">收市：10.0，回到區內</text><rect x="80" y="386" width="560" height="38" rx="4" fill="#eaf0f5"/><text x="98" y="411" font-size="16">另一天收市 9.6：符合事先訂下的收市失守條件</text>`;
  } else if(slug==="rsi-in-strong-trends"&&index===0){
    s+=title("價格創高時，RSI 可在 70 以上停留")+title("同一時間軸　·　假設走勢",40,78,15,500,"#506174");
    s+=`<text x="48" y="128" font-size="16" font-weight="700">價格</text><line x1="100" y1="205" x2="660" y2="205" stroke="#dce4ea"/><polyline points="105,192 174,178 235,184 302,156 363,164 428,133 494,142 558,107 642,88" fill="none" stroke="#185bd1" stroke-width="4" stroke-linejoin="round"/><text x="585" y="78" font-size="15" fill="#185bd1">高位提高</text><line x1="100" y1="329" x2="660" y2="329" stroke="#b45309" stroke-width="2" stroke-dasharray="6 5"/><text x="52" y="286" font-size="16" font-weight="700">RSI</text><text x="664" y="334" font-size="14" fill="#b45309">70</text><polyline points="105,361 174,337 235,319 302,310 363,292 428,299 494,280 558,271 642,260" fill="none" stroke="#18794e" stroke-width="4" stroke-linejoin="round"/><text x="480" y="249" font-size="15" fill="#18794e">高於 70，並非上限</text><text x="100" y="399" font-size="14" fill="#506174">前段　　時間　　後段</text>`;
  } else if(slug==="rsi-in-strong-trends"){
    s+=title("由平滑平均升跌幅計算 RSI")+`<rect x="50" y="102" width="280" height="100" rx="5" fill="#eaf0f5"/><rect x="390" y="102" width="280" height="100" rx="5" fill="#eaf0f5"/>`+title("平均升幅",72,139,17)+title("0.3 元",72,177,27,700,"#185bd1")+title("平均跌幅",412,139,17)+title("0.1 元",412,177,27,700,"#b45309");
    s+=`<text x="70" y="259" font-size="20">相對比率 = 0.3 ÷ 0.1 = 3</text><line x1="70" y1="281" x2="650" y2="281" stroke="#dce4ea"/><text x="70" y="327" font-size="19">RSI = 100 − 100 ÷ (1 + 3)</text><text x="70" y="389" font-size="32" font-weight="700" fill="#185bd1">= 75</text><text x="184" y="387" font-size="16" fill="#506174">教學算例；平滑方法會影響結果</text>`;
  } else if(slug==="hong-kong-trading-day"&&index===0){
    s+=title("一般全日市的時段與空檔")+title("香港時間　·　適用證券與當日安排須另核對",40,78,15,500,"#506174");
    const blocks=[{x:64,w:94,t:"09:00–09:30",u:"開市前"},{x:158,w:203,t:"09:30–12:00",u:"早市"},{x:361,w:72,t:"12:00",u:"休市"},{x:433,w:176,t:"13:00–16:00",u:"午市"},{x:609,w:55,t:"16:00",u:"競價"}];
    s+='<line x1="64" y1="189" x2="664" y2="189" stroke="#a9b8c7" stroke-width="2"/>';
    blocks.forEach((b,i)=>{s+=`<rect x="${b.x}" y="${i===2?150:136}" width="${b.w}" height="72" fill="${i===2?'#e3e8ee':i===4?'#dbe8f5':'#eaf0f5'}" stroke="#fff"/><text x="${b.x+6}" y="160" font-size="${b.w<70?12:14}" font-weight="700">${b.t}</text><text x="${b.x+6}" y="194" font-size="${b.w<70?12:14}">${b.u}</text>`;});
    s+=`<text x="64" y="258" font-size="16" font-weight="700">收市競價於 16:00 開始；16:08 至 16:10 之間隨機收市</text><line x1="64" y1="293" x2="664" y2="293" stroke="#dce4ea"/><text x="64" y="332" font-size="16">午間休市 12:00–13:00；普通股份沒有持續交易。</text><text x="64" y="367" font-size="16">時段分界會影響報價更新與委託處理，不代表價格停止變動風險。</text>`;
  } else if(slug==="hong-kong-trading-day"){
    s+=title("先分清報價更新與委託狀態")+title("示意流程，不代表所有券商介面",40,78,15,500,"#506174");
    const boxes=[{x:46,w:145,h:"休市中",d:"畫面可能保留上一口價"},{x:211,w:145,h:"新時段",d:"市場重新接受及撮合"},{x:376,w:145,h:"券商已接收",d:"收到指示，不等於成交"},{x:541,w:145,h:"成交回報",d:"查看實際價格與數量"}];
    for(let i=0;i<boxes.length;i++){let b=boxes[i];s+=`<rect x="${b.x}" y="151" width="${b.w}" height="138" fill="#fff" stroke="#dce4ea"/><circle cx="${b.x+22}" cy="176" r="7" fill="${i===3?'#18794e':'#285f96'}"/>${title(b.h,b.x+14,215,18)}<text x="${b.x+14}" y="254" font-size="14">${b.d}</text>`;if(i<boxes.length-1)s+=`<path d="M${b.x+b.w+3} 220h16m-5-5 5 5-5 5" stroke="#506174" fill="none" stroke-width="2"/>`;}
    s+=`<rect x="66" y="340" width="588" height="60" fill="#eaf0f5"/><text x="84" y="376" font-size="16" font-weight="700">顯示「已接收」時，仍要等成交回報確認是否成交</text>`;
  } else if(slug==="position-size-stop-distance"&&index===0){
    s+=title("先定風險預算，再計理論股數")+title("教學算例　·　未計費用、差價及滑價",40,78,15,500,"#506174");
    s+=`<rect x="48" y="115" width="170" height="105" fill="#eaf0f5"/><rect x="275" y="115" width="170" height="105" fill="#eaf0f5"/><rect x="502" y="115" width="170" height="105" fill="#eaf0f5"/><text x="68" y="151" font-size="16">風險預算</text><text x="68" y="191" font-size="27" font-weight="700" fill="#185bd1">1,000 元</text><text x="295" y="151" font-size="16">每股距離</text><text x="295" y="191" font-size="27" font-weight="700">20 − 19 = 1</text><text x="522" y="151" font-size="16">理論數量</text><text x="522" y="191" font-size="27" font-weight="700" fill="#185bd1">1,000 股</text><path d="M218 168h48m-7-7 7 7-7 7M445 168h48m-7-7 7 7-7 7" stroke="#506174" fill="none" stroke-width="2"/><text x="70" y="281" font-size="19">股數 = 風險預算 ÷（入市價 − 止蝕價）</text><line x1="70" y1="306" x2="650" y2="306" stroke="#dce4ea"/><text x="70" y="351" font-size="17">名義投入：1,000 × 20 = 20,000 元</text><text x="70" y="389" font-size="16" fill="#b45309">若以 18.8 元退出，每股損失 1.2 元，合計 1,200 元</text>`;
  } else {
    s+=title("止蝕距離改變，理論數量也改變")+title("同一 1,000 元風險預算　·　教學算例",40,78,15,500,"#506174");
    const rows=[{y:151,label:"入市 20　止蝕 19",dist:"1 元",shares:"1,000 股",w:430},{y:246,label:"入市 20　止蝕 19.5",dist:"0.5 元",shares:"2,000 股",w:215}];
    for(const r of rows){s+=`<text x="54" y="${r.y}" font-size="17" font-weight="700">${r.label}</text><text x="54" y="${r.y+28}" font-size="14" fill="#506174">每股距離 ${r.dist} → ${r.shares}</text><rect x="260" y="${r.y-24}" width="${r.w}" height="31" fill="#dcebf1"/><line x1="260" y1="${r.y+9}" x2="660" y2="${r.y+9}" stroke="#a9b8c7"/>`;}
    s+=`<rect x="52" y="328" width="616" height="70" fill="#fff" stroke="#dce4ea"/><text x="72" y="359" font-size="16">股數向下取整至可執行手數；近止蝕不代表較低風險。</text><text x="72" y="383" font-size="15" fill="#506174">裂口或較差成交可令實際虧損超出估算。</text>`;
  }
  return s+foot;
}
function pilotTitle(slug,index){const titles={"support-resistance-zones":["同一支持區的三種收市結果","盤中低位與收市位置"],"rsi-in-strong-trends":["價格與 RSI 在強勢時的關係","由平均升跌幅計算 RSI 75"],"hong-kong-trading-day":["一般全日市的交易時段","報價更新與委託狀態"],"position-size-stop-distance":["由風險預算計出理論股數","止蝕距離與理論股數"]};return titles[slug][index];}
function cover(slug,title){
 const base=`<svg xmlns="http://www.w3.org/2000/svg" width="220" height="150" viewBox="0 0 220 150" role="img" aria-labelledby="t"><title id="t">${xml(title)}｜教學封面圖</title><rect width="220" height="150" fill="#eef3f7"/><g fill="none" stroke-linecap="round" stroke-linejoin="round">`;
 let marks="";
 if(slug==="support-resistance-zones") marks='<rect x="30" y="54" width="164" height="34" fill="#d5e5ed" stroke="none"/><path d="M25 109 57 79 82 95 111 48 139 72 169 34 197 58" stroke="#185bd1" stroke-width="4"/><path d="M29 54h165M29 88h165" stroke="#285f96" stroke-dasharray="5 5" stroke-width="2"/>';
 else if(slug==="rsi-in-strong-trends") marks='<path d="M28 58 55 48 81 54 106 38 132 43 160 25 194 19M28 104 55 92 81 86 106 83 132 70 160 68 194 61" stroke="#185bd1" stroke-width="4"/><path d="M28 111h166" stroke="#b45309" stroke-width="2" stroke-dasharray="5 5"/>';
 else if(slug==="hong-kong-trading-day") marks='<path d="M25 73h170" stroke="#a9b8c7" stroke-width="3"/><rect x="28" y="52" width="47" height="42" fill="#dce8f1" stroke="none"/><rect x="76" y="52" width="49" height="42" fill="#c8dcef" stroke="none"/><rect x="126" y="52" width="25" height="42" fill="#dfe5eb" stroke="none"/><rect x="152" y="52" width="42" height="42" fill="#dce8f1" stroke="none"/><path d="M28 107h166" stroke="#506174" stroke-width="2"/>';
 else marks='<rect x="25" y="34" width="48" height="32" fill="#dce8f1" stroke="none"/><rect x="87" y="34" width="48" height="32" fill="#e5edf2" stroke="none"/><rect x="149" y="34" width="48" height="32" fill="#dce8f1" stroke="none"/><path d="M73 50h13m-4-5 5 5-5 5M135 50h13m-4-5 5 5-5 5M36 104h150" stroke="#506174" stroke-width="2"/><path d="M48 102V82m0 0-7 8m7-8 7 8M111 102V75m0 0-7 8m7-8 7 8M174 102V61m0 0-7 8m7-8 7 8" stroke="#185bd1" stroke-width="4"/>';
 return base+marks+'</g></svg>\n';
}
