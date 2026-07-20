import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_PATH = path.join(ROOT, "data", "site", "public_copy.json");
const WRAPPER_PATH = path.join(ROOT, "data", "site", "public_copy.js");

const source = await readFile(SOURCE_PATH, "utf8");
const catalog = JSON.parse(source);
const wrapper = `window.__PUBLIC_COPY__ = ${JSON.stringify(catalog, null, 2)};\n`;

await writeFile(WRAPPER_PATH, wrapper, "utf8");
