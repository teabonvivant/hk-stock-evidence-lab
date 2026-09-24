import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const basePath = "/hk-stock-evidence-lab";
const siteUrl = `https://teabonvivant.github.io${basePath}`;
// Vinext 0.0.50 omits basePath on its internal prerender requests. Keep this
// narrow, version-checked compatibility fix local to the export process.
const prerenderFile = new URL("../node_modules/vinext/dist/build/prerender.js", import.meta.url);
const vinextPackage = JSON.parse(await readFile(new URL("../node_modules/vinext/package.json", import.meta.url), "utf8"));
const prerenderSource = await readFile(prerenderFile, "utf8");
const requestLine = 'const url = `${baseUrl}${parsed.pathname}${parsed.search}`;';
if (vinextPackage.version !== "0.0.50" || !prerenderSource.includes(requestLine)) {
  throw new Error("Review the Vinext basePath export compatibility fix before upgrading Vinext.");
}
await writeFile(prerenderFile, prerenderSource.replace(requestLine, 'const url = `${baseUrl}${config.basePath || ""}${parsed.pathname}${parsed.search}`;'));
let result;
try {
  result = spawnSync(process.execPath, ["node_modules/vinext/dist/cli.js", "build"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, GITHUB_PAGES: "true", NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_SITE_URL: siteUrl },
  });
} finally {
  await writeFile(prerenderFile, prerenderSource);
}
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

// RSS is a checked-in public file, so its absolute links need the publication URL.
const feed = await readFile(new URL("../public/feed.xml", import.meta.url), "utf8");
await writeFile(new URL("../dist/client/feed.xml", import.meta.url), feed.replaceAll("https://technical-indicators-hk.teabonvivant.chatgpt.site", siteUrl));
await writeFile(new URL("../dist/client/.nojekyll", import.meta.url), "");

// Metadata route handlers are not included in Vinext's App Router static export.
const manifest = JSON.parse(await readFile(new URL("../dist/server/vinext-prerender.json", import.meta.url), "utf8"));
const routes = manifest.routes.filter(route => route.status === "rendered" && route.path).map(route => route.path);
if (routes.length !== 227) throw new Error(`Expected 227 public routes, exported ${routes.length}. Review the publication audit when adding pages.`);
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + routes.map(route => `  <url><loc>${siteUrl}${route === "/" ? "/" : `${route}/`}</loc><lastmod>2026-09-24</lastmod></url>`).join("\n")
  + "\n</urlset>\n";
await writeFile(new URL("../dist/client/sitemap.xml", import.meta.url), sitemap);
await writeFile(new URL("../dist/client/robots.txt", import.meta.url), `User-agent: *\nAllow: ${basePath}/\n\nUser-agent: GPTBot\nDisallow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
