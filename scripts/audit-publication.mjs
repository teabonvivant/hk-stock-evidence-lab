import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
const root=path.resolve(import.meta.dirname,"..");
const read=async p=>JSON.parse(await fs.readFile(path.join(root,p),"utf8"));
const articles=await read("data/site/blog-articles.json"),catalog=await read("data/site/technical_indicators_site_data.json"),strategies=await read("data/site/tradingview_strategy_cases.json");
const bases=["","indicators","strategy-cases","tv-strategies","learn","toolbox","candlesticks","compare","playground","casebook","glossary","subscribe","journal","combo","script","script-demo","trial","sitemap","blog","trust","about/team","editorial-policy","methodology/data","methodology/backtesting","ai-disclosure","corrections","conflicts","risk-disclosure","contact/report-error","privacy"];
const routes=[...bases.map(p=>"/"+p),...["indicators","hong-kong","risk","backtesting","pine-script"].map(c=>"/blog/category/"+c),...articles.map(a=>"/blog/"+a.slug),...catalog.indicators.map(i=>"/indicators/"+i.siteSlug),...strategies.cases.map(i=>"/strategy-cases/"+i.slug)];
const {default:worker}=await import("../dist/server/index.js");
const failures=[],pages=new Map(),images=new Set(),titles=new Set();
const banned=["needs_manual_strategy_report","local_template_only","teaching-baseline","前端教學頁","具名覆核完成前","尚未完成全部核對","具名作者：尚未公開","技術覆核：尚未完成","目前沒有研究通過完整發布閘門","在現今快節奏的社會中","總括而言","讓我們一起探索","跳空","收盤價","量能"];
const decode=s=>s.replace(/&amp;/g,"&").replace(/&quot;/g,'"');
for(const route of routes){
 const response=await worker.fetch(new Request("http://localhost"+route,{headers:{accept:"text/html"}}),{ASSETS:{fetch:async()=>new Response("Not found",{status:404})}},{waitUntil(){},passThroughOnException(){}});
 const html=await response.text();pages.set(route,html);
 const visible=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,"").replace(/<style\b[^>]*>[\s\S]*?<\/style>/g,"").replace(/<[^>]+>/g," ");
 const error=(why)=>failures.push({route,why});
 if(response.status!==200)error("HTTP "+response.status);
 if([...html.matchAll(/<h1\b/g)].length!==1)error("Expected one primary heading");
 const title=html.match(/<title>(.*?)<\/title>/)?.[1];
 if(!title||titles.has(title))error("Missing or duplicate page title");titles.add(title);
 if(!/<meta name="description" content="[^"]{20,}"/.test(html))error("Missing useful description");
 const canonical=decode(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]??"");
 if(canonical!=="https://technical-indicators-hk.teabonvivant.chatgpt.site"+(route==="/"?"/":route))error("Wrong canonical "+canonical);
 if(/content="noindex/.test(html))error("Unexpected noindex");
 for(const term of banned)if(visible.includes(term))error("Unedited public term: "+term);
 for(const m of html.matchAll(/<img\b[^>]*>/g)){
  const src=decode(m[0].match(/\bsrc="([^"]+)"/)?.[1]??"");
  if(!src)error("Image without source");if(!/\balt="[^"]+"/.test(m[0])&&!(/\balt=""/.test(m[0])&&/\baria-hidden="true"/.test(m[0])))error("Image without text alternative or explicit decorative semantics");images.add(src);
 }
 if(route.startsWith("/blog/")&&!route.startsWith("/blog/category/")&&[...html.matchAll(/<img\b[^>]+src="\/illustrations\/blog\//g)].length!==2)error("Article must display two dedicated figures");
}
let links=0;
for(const [route,html]of pages){
 for(const m of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)){
  const href=decode(m[1]);if(!href.startsWith("/")&&!href.startsWith("#"))continue;links++;
  const u=new URL(href,"http://local"+route),dest=u.pathname.replace(/\/$/,"")||"/";
  if(pages.has(dest)){
   const target=pages.get(dest);
   if(u.hash&&!target.includes('id="'+decodeURIComponent(u.hash.slice(1))+'"'))failures.push({route,why:"Missing section "+href});
  }else if(!/\.[a-z0-9]+$/i.test(dest))failures.push({route,why:"Unmapped internal page "+href});
  else try{await fs.access(path.join(root,"public",decodeURIComponent(dest)));}catch{failures.push({route,why:"Missing linked file "+href});}
 }
}
for(const src of images)try{
 const asset=await fs.readFile(path.join(root,"public",src));
 if(src.endsWith(".svg")){const svg=asset.toString("utf8");assert.match(svg,/<title[^>]*>[^<]+<\/title>/);assert.match(svg,/<desc[^>]*>[^<]+<\/desc>/);}
 else if(src.endsWith(".png"))assert.equal(asset.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 else if(src.endsWith(".webp")){assert.equal(asset.subarray(0,4).toString(),"RIFF");assert.equal(asset.subarray(8,12).toString(),"WEBP");}
 else assert.ok(asset.length>0,"Image file is empty");
}catch(e){failures.push({asset:src,why:e.message});}
const rss=await fs.readFile(path.join(root,"public/feed.xml"),"utf8");
if([...rss.matchAll(/<item>/g)].length!==100)failures.push({why:"RSS does not contain all articles"});
const result={routes:routes.length,internalLinks:links,distinctImages:images.size,articles:articles.length,blogFigures:articles.reduce((n,a)=>n+a.figures.length,0),failures};
await fs.mkdir(path.join(root,".content-cache"),{recursive:true});
await fs.writeFile(path.join(root,".content-cache/route-audit.json"),JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
if(failures.length)process.exitCode=1;
