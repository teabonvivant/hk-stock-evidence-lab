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
    await save("public/illustrations/blog/"+a.slug+"-"+(i+1)+".svg",diagram(f));
    report.blogFigures++;
  }
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
