import assert from "node:assert/strict";
import test from "node:test";
import {buildSync} from "esbuild";
import {createRequire} from "node:module";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const root=path.resolve(import.meta.dirname,"..");
const result=buildSync({stdin:{contents:'export * from "./lib/risk-math";export * from "./lib/indicator-math-oscillators";',loader:"ts",resolveDir:root},bundle:true,platform:"node",format:"cjs",write:false,tsconfig:path.join(root,"tsconfig.json")});
await mkdir(path.join(root,".content-cache"),{recursive:true});
const file=path.join(root,".content-cache/math.cjs");await writeFile(file,result.outputFiles[0].text);
const {positionSize,recoveryPercent,stochastic,rsi,mfi}=createRequire(import.meta.url)(file);
const normal={capital:100000,riskPercent:1,entry:100,stop:95,target:110,lot:100,fees:100,slippage:.2};
test("position sizing respects whole lots, fee reserve and risk budget",()=>{
 const p=positionSize(normal);assert.equal(p.shares,100);assert.equal(p.loss,620);assert.ok(Math.abs(p.profit-880)<1e-9);
 const zero=positionSize({...normal,fees:0,slippage:0});assert.equal(zero.shares,200);assert.equal(zero.loss,1000);
 assert.equal(positionSize({...normal,fees:1001}).shares,0);
 assert.equal(positionSize({...normal,stop:100}),null);
 assert.equal(positionSize({...normal,lot:1.5}),null);
 assert.equal(positionSize({...normal,capital:NaN}),null);
 const cash=positionSize({...normal,capital:1000,riskPercent:100,lot:1,fees:0,slippage:0});
 assert.equal(cash.shares,10);assert.equal(cash.amount,1000);
});
test("drawdown recovery uses the reduced capital base",()=>{
 assert.equal(recoveryPercent(20),25);assert.equal(recoveryPercent(50),100);assert.equal(recoveryPercent(100),null);assert.equal(recoveryPercent(-1),null);
});
test("slow stochastic applies K smoothing before D",()=>{
 const bars=[1,3,5,7,9,4,2].map((close,i)=>({date:String(i),open:close,close,high:10,low:0,volume:10}));
 const s=stochastic(bars,3,2,2);
 assert.deepEqual(s.middle,[null,null,null,60,80,65,30]);
 assert.deepEqual(s.upper,[null,null,null,null,70,72.5,47.5]);
});
test("RSI distinguishes strong gains from a flat series",()=>{
 assert.deepEqual(rsi([10,11,12,11],2),[null,null,100,50]);
 assert.deepEqual(rsi([10,10,10,10],2),[null,null,null,null]);
});
test("MFI waits for complete directional comparisons and handles zero flow",()=>{
 const make=p=>p.map((v,i)=>({date:String(i),open:v,high:v,low:v,close:v,volume:10}));
 assert.deepEqual(mfi(make([1,2,3,2]),2),[null,null,100,60]);
 assert.deepEqual(mfi(make([1,1,1,1]),2),[null,null,null,null]);
});
