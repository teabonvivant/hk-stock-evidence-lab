import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("Hong Kong terminology contract covers canonical indicator copy", async () => {
  // Given the two canonical public indicator catalogs
  const sources = await Promise.all([
    readFile(new URL("data/site/technical_indicators_site_data.json", projectRoot), "utf8"),
    readFile(new URL("data/site/public_copy.json", projectRoot), "utf8"),
  ]);

  // When terminology that must be localised for Hong Kong readers is checked
  const catalogText = sources.join("\n");
  const nonHongKongTerms = ["收盤價", "跳空", "上穿", "下穿", "止損", "止盈", "當沖", "大盤"];

  // Then none remains in the canonical rendered-copy sources
  for (const term of nonHongKongTerms) {
    assert.equal(catalogText.includes(term), false, `non-Hong-Kong term found: ${term}`);
  }
});

test("data manifest schema requires reproducibility and review fields", async () => {
  // Given the machine-readable data-manifest contract
  const schema = JSON.parse(
    await readFile(new URL("schema/data-manifest.schema.json", projectRoot), "utf8"),
  );

  // When its required fields are inspected
  const required = new Set(schema.required);
  const expected = [
    "symbol",
    "exchange",
    "timezone",
    "timeframe",
    "start",
    "end",
    "price_adjustment",
    "corporate_actions",
    "data_provider",
    "retrieved_at",
    "indicator",
    "parameters",
    "formula_version",
    "chart_version",
    "reviewer",
    "checksum",
  ];

  // Then a chart cannot be described without provenance, versions, and review state
  for (const field of expected) {
    assert.equal(required.has(field), true, `required manifest field missing: ${field}`);
  }
  assert.equal(schema.properties.timezone.const, "Asia/Hong_Kong");
});

test("design contract names the P0 trust primitives", async () => {
  // Given the current project design system
  const design = await readFile(new URL("DESIGN.md", projectRoot), "utf8");

  // When the implementation primitives are checked
  const requiredPrimitives = [
    "Research Status Banner",
    "Direct Answer And Key Takeaways",
    "Evidence Pipeline",
    "Accountability Footer",
    "Policy Page",
  ];

  // Then every P0 primitive is specified before UI code uses it
  for (const primitive of requiredPrimitives) {
    assert.match(design, new RegExp(primitive));
  }
});
