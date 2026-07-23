import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const siteDataPath = path.join(root, "data", "site", "technical_indicators_site_data.json");
const siteWrapperPath = path.join(root, "data", "site", "technical_indicators_site_data.js");
const publicCopyPath = path.join(root, "data", "site", "public_copy.json");
const publicWrapperPath = path.join(root, "data", "site", "public_copy.js");
const judgmentsPath = path.join(root, "data", "site", "indicator_editorial_judgments_hk.json");
const coreLearningPath = path.join(root, "data", "site", "core_indicator_learning.json");
const legacyAppPath = path.join(root, "app.js");

const siteData = JSON.parse(await readFile(siteDataPath, "utf8"));
const publicCopy = JSON.parse(await readFile(publicCopyPath, "utf8"));
const judgments = JSON.parse(await readFile(judgmentsPath, "utf8"));
const coreLearning = JSON.parse(await readFile(coreLearningPath, "utf8"));
const legacyApp = await readFile(legacyAppPath, "utf8");

const siteSlugs = siteData.indicators.map((item) => item.siteSlug);
const judgmentSlugs = Object.keys(judgments);
const missing = siteSlugs.filter((slug) => !judgments[slug]);
const unknown = judgmentSlugs.filter((slug) => !siteSlugs.includes(slug));

if (missing.length > 0 || unknown.length > 0) {
  throw new Error(`Editorial judgment coverage mismatch. Missing: ${missing.join(", ") || "none"}; unknown: ${unknown.join(", ") || "none"}.`);
}

const publicCopyBySlug = new Map(publicCopy.indicators.map((item) => [item.siteSlug, item]));

for (const indicator of siteData.indicators) {
  const judgment = judgments[indicator.siteSlug];
  indicator.research.judgmentZh = judgment;
  indicator.summary = localizeHongKongTerms(indicator.summary);
  indicator.uses = indicator.uses.map(localizeHongKongTerms);
  indicator.signals = indicator.signals.map(localizeHongKongTerms);
  indicator.mistakes = indicator.mistakes.map(localizeHongKongTerms);
  indicator.limitations = indicator.limitations.map(localizeHongKongTerms);

  const publicIndicator = publicCopyBySlug.get(indicator.siteSlug);
  if (!publicIndicator) throw new Error(`Public-copy indicator missing: ${indicator.siteSlug}`);
  publicIndicator.judgmentZh = judgment;
  publicIndicator.summary = localizeHongKongTerms(publicIndicator.summary);
  publicIndicator.signals = publicIndicator.signals.map(localizeHongKongTerms);
  publicIndicator.mistakes = publicIndicator.mistakes.map(localizeHongKongTerms);
  publicIndicator.limitations = publicIndicator.limitations.map(localizeHongKongTerms);
}

for (const item of coreLearning.items) localizeLearningItem(item);
localizeDeep(siteData);
localizeDeep(publicCopy);

const siteJson = `${JSON.stringify(siteData, null, 2)}\n`;
const publicJson = `${JSON.stringify(publicCopy, null, 2)}\n`;
const coreLearningJson = formatCoreLearningCatalog(coreLearning);

await writeFile(siteDataPath, siteJson, "utf8");
await writeFile(siteWrapperPath, `window.__TI_DATA__ = ${siteJson.trimEnd()};\n`, "utf8");
await writeFile(publicCopyPath, publicJson, "utf8");
await writeFile(publicWrapperPath, `window.__PUBLIC_COPY__ = ${publicJson.trimEnd()};\n`, "utf8");
await writeFile(coreLearningPath, coreLearningJson, "utf8");
await writeFile(legacyAppPath, localizeHongKongTerms(legacyApp), "utf8");

console.log(`Applied ${siteSlugs.length} Hong Kong Chinese editorial judgments.`);

function localizeHongKongTerms(value) {
  return value
    .replaceAll("價格量能", "價量配合")
    .replaceAll("突破量能", "突破時的成交量")
    .replaceAll("量能", "成交量")
    .replaceAll("收盤價", "收市價")
    .replaceAll("跳空", "裂口")
    .replaceAll("上穿", "升穿")
    .replaceAll("下穿", "跌穿")
    .replaceAll("止損", "止蝕")
    .replaceAll("止盈", "止賺")
    .replaceAll("當沖", "即市")
    .replaceAll("大盤", "大市");
}

function localizeDeep(value) {
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      value[index] = typeof value[index] === "string" ? localizeHongKongTerms(value[index]) : value[index];
      localizeDeep(value[index]);
    }
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, entry] of Object.entries(value)) {
    value[key] = typeof entry === "string" ? localizeHongKongTerms(entry) : entry;
    localizeDeep(value[key]);
  }
}

function localizeLearningItem(item) {
  for (const [key, value] of Object.entries(item)) {
    if (typeof value === "string") item[key] = localizeHongKongTerms(value);
    if (Array.isArray(value) && value.every((entry) => typeof entry === "string")) item[key] = value.map(localizeHongKongTerms);
  }
}

function formatCoreLearningCatalog(catalog) {
  const items = catalog.items.map((item) => {
    const entries = Object.entries(item).map(([key, value], index, allEntries) => {
      const suffix = index === allEntries.length - 1 ? "" : ",";
      let serialized = JSON.stringify(value);
      if (Array.isArray(value)) serialized = `[${value.map((entry) => JSON.stringify(entry)).join(", ")}]`;
      if (key === "sources") serialized = `[${value.map((source) => `{ "label": ${JSON.stringify(source.label)}, "url": ${JSON.stringify(source.url)} }`).join(", ")}]`;
      return `      ${JSON.stringify(key)}: ${serialized}${suffix}`;
    });
    return `    {\n${entries.join("\n")}\n    }`;
  });
  return `{\n  "items": [\n${items.join(",\n")}\n  ]\n}\n`;
}
