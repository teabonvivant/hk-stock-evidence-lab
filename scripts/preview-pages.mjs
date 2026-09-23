import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist/client/", import.meta.url));
const basePath = "/hk-stock-evidence-lab";
const port = Number(process.env.PORT || 4178);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2", ".rsc": "text/x-component", ".xml": "application/xml", ".txt": "text/plain" };
createServer(async (request, response) => {
  const url = new URL(request.url, `http://localhost:${port}`);
  try {
    if (url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) throw new Error("Outside project");
    const localPath = decodeURIComponent(url.pathname.slice(basePath.length));
    let target = path.resolve(root, `.${localPath || "/"}`);
    if (target !== root.replace(/[\\/]$/, "") && !target.startsWith(root)) throw new Error("Outside root");
    if ((await stat(target)).isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        response.writeHead(301, { Location: `${url.pathname}/${url.search}` });
        response.end(); return;
      }
      target = path.join(target, "index.html");
    }
    response.writeHead(200, { "Content-Type": types[path.extname(target)] || "application/octet-stream" });
    response.end(await readFile(target));
  } catch {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(await readFile(path.join(root, "404.html")));
  }
}).listen(port, "127.0.0.1", () => console.log(`Static Pages preview: http://127.0.0.1:${port}${basePath}/`));
