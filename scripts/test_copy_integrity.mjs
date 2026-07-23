import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

const ROOT = path.resolve(import.meta.dirname, '..');
const DATA_DIR = path.join(ROOT, 'data', 'site');
const CURRENT_INDICATORS_PATH = path.join(DATA_DIR, 'technical_indicators_site_data.json');
const EDITORIAL_JUDGMENTS_PATH = path.join(DATA_DIR, 'indicator_editorial_judgments_hk.json');

export async function readCatalog(root = ROOT) {
  const catalogPath = path.join(root, 'data', 'site', 'public_copy.json');
  let source;
  try {
    source = await readFile(catalogPath, 'utf8');
  } catch (error) {
    throw new Error(`Unable to read public copy catalog at ${catalogPath}: ${error.message}`, { cause: error });
  }
  try {
    return JSON.parse(source);
  } catch (error) {
    throw new Error(`Malformed public copy catalog at ${catalogPath}: ${error.message}`, { cause: error });
  }
}

function indicatorRecords(catalog) {
  if (Array.isArray(catalog.indicators)) return catalog.indicators;
  if (catalog.indicators && typeof catalog.indicators === 'object') return Object.values(catalog.indicators);
  if (Array.isArray(catalog.catalog)) return catalog.catalog;
  return [];
}

function judgments(records) {
  return records
    .map((record) => record?.research?.judgmentZh ?? record?.judgmentZh ?? record?.judgment)
    .filter((value) => typeof value === 'string');
}

async function currentIndicatorRecords() {
  return JSON.parse(await readFile(CURRENT_INDICATORS_PATH, 'utf8')).indicators;
}

async function readSources(files) {
  return (await Promise.all(files.map(async (file) => {
    try { return await readFile(file, 'utf8'); } catch (error) { if (error.code === 'ENOENT') return ''; throw error; }
  }))).join('\n');
}

test('readCatalog reports a missing catalog path', async () => {
  // Given a temporary root without the public copy catalog
  const root = await mkdtemp(path.join(tmpdir(), 'copy-integrity-missing-'));
  try {
    // When the catalog reader is invoked
    const result = readCatalog(root);
    // Then the diagnostic identifies the missing public_copy.json file
    await assert.rejects(result, /Unable to read public copy catalog.*public_copy\.json/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('readCatalog reports malformed JSON', async () => {
  // Given a temporary root containing malformed catalog JSON
  const root = await mkdtemp(path.join(tmpdir(), 'copy-integrity-malformed-'));
  const site = path.join(root, 'data', 'site');
  await mkdir(site, { recursive: true });
  await writeFile(path.join(site, 'public_copy.json'), '{ not-json', 'utf8');
  try {
    // When the catalog reader is invoked
    const result = readCatalog(root);
    // Then the diagnostic identifies malformed public_copy.json content
    await assert.rejects(result, /Malformed public copy catalog.*public_copy\.json/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('public copy catalog JSON exists', async () => {
  // Given the canonical catalog path
  // When the catalog artifact is read
  const read = readFile(path.join(DATA_DIR, 'public_copy.json'), 'utf8');
  // Then the JSON source exists
  await assert.doesNotReject(read);
});

test('public copy browser wrapper exists', async () => {
  // Given the static wrapper path
  // When the browser artifact is read
  const read = readFile(path.join(DATA_DIR, 'public_copy.js'), 'utf8');
  // Then the JavaScript wrapper exists
  await assert.doesNotReject(read);
});

test('catalog contains exactly 82 indicator records', async () => {
  // Given the canonical public-copy catalog
  const catalog = await readCatalog();
  // When indicator records are selected
  const records = indicatorRecords(catalog);
  // Then every public indicator has exactly one catalog record
  assert.equal(records.length, 82);
});

test('Hong Kong editorial judgments cover and match every indicator', async () => {
  const records = await currentIndicatorRecords();
  const editorialJudgments = JSON.parse(await readFile(EDITORIAL_JUDGMENTS_PATH, 'utf8'));
  assert.equal(Object.keys(editorialJudgments).length, records.length);

  for (const record of records) {
    assert.equal(
      record.research.judgmentZh,
      editorialJudgments[record.siteSlug],
      `editorial judgment mismatch: ${record.siteSlug}`,
    );
  }
});

test('current indicator JSON has no legacy judgment templates', async () => {
  // Given the judgments that currently feed the public indicator pages
  const renderedJudgments = judgments(await currentIndicatorRecords());
  // When the two known batch templates are counted
  const legacyTemplates = ['優勝，因其在原創性、專屬性與資料覆蓋上最強', '是目前資料庫中唯一對應'];
  // Then neither legacy sentence frame remains
  for (const template of legacyTemplates) assert.equal(renderedJudgments.some((value) => value.includes(template)), false, `legacy judgment template found: ${template}`);
});

test('current indicator JSON has no duplicate full judgments', async () => {
  // Given the full expert judgment for each distinct indicator concept
  const renderedJudgments = judgments(await currentIndicatorRecords());
  // When exact duplicate prose is checked
  const duplicateCount = renderedJudgments.length - new Set(renderedJudgments).size;
  // Then every concept has an independently written judgment
  assert.equal(duplicateCount, 0, `${duplicateCount} duplicate full judgments found`);
});

test('rendered public copy excludes banned internal and Taiwan-style wording', async () => {
  // Given explicit rendered-copy locations in the static and Next surfaces
  const renderedSource = await readSources([
    path.join(ROOT, 'app.js'),
    path.join(ROOT, 'index.html'),
    path.join(ROOT, 'components', 'site', 'pages', 'home-page.tsx'),
    path.join(ROOT, 'components', 'site', 'pages', 'simple-pages.tsx'),
    path.join(ROOT, 'components', 'site', 'pages', 'strategy-pages.tsx'),
    path.join(ROOT, 'components', 'site', 'indicator-beginner-guide.tsx'),
    path.join(ROOT, 'lib', 'indicator-beginner-market-guides.ts'),
    path.join(ROOT, 'lib', 'indicator-beginner-context-guides.ts'),
    path.join(ROOT, 'lib', 'indicator-beginner-specific-guides.ts'),
  ]);
  const renderedContexts = renderedSource
    .split(/\r?\n/)
    .filter((line) => /<[^>]+|title=|body=|label=|rows=|eyebrow=|description|judgmentZh|\b(?:title|body|label|summary|uses|limitations|mistakes|caution|lesson|action)\s*:/.test(line))
    .join('\n');
  // When banned public terms are checked only in known rendered-copy contexts
  const banned = ['accepted', 'support-only', 'rejected', 'raw leads', 'runner-up', 'explicit status', 'taxonomy', '前端教學頁', '量能', '讓你', '幫你', '提醒你'];
  // Then internal enum comparisons remain allowed but public labels do not leak them
  for (const phrase of banned) assert.equal(renderedContexts.toLowerCase().includes(phrase.toLowerCase()), false, `banned public string found: ${phrase}`);
});

test('public strategy statuses use the required Chinese labels', async () => {
  // Given public status maps and rendered status copy on both surfaces
  const publicStatusSource = await readSources([
    path.join(ROOT, 'app.js'),
    path.join(ROOT, 'components', 'site', 'pages', 'strategy-pages.tsx'),
    path.join(ROOT, 'components', 'site', 'strategy-card.tsx'),
  ]);
  // When the editorial contract's three public labels are checked
  const requiredStatuses = ['已完成全部核對', '待完成核對', '不採用'];
  // Then every internal status has its required Chinese public equivalent
  for (const label of requiredStatuses) assert.equal(publicStatusSource.includes(label), true, `required Chinese status missing: ${label}`);
});

test('term dictionary covers required technical terms', async () => {
  // Given the catalog term dictionary
  const catalog = await readCatalog();
  const dictionary = catalog.terms ?? catalog.termDictionary ?? catalog.dictionary ?? {};
  const dictionaryText = JSON.stringify(dictionary);
  // When the required terms are checked
  const requiredTerms = ['PF', 'OOS', 'RMA', 'ATR', 'EMA', 'Strategy Report', 'Properties'];
  // Then every technical term has a catalog entry
  for (const term of requiredTerms) {
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(dictionaryText, new RegExp(`(?:^|[^A-Za-z])${escapedTerm}(?:$|[^A-Za-z])`, 'i'), `missing term dictionary entry: ${term}`);
  }
});

test('browser wrapper payload has parity with canonical JSON', async () => {
  // Given canonical JSON and the static browser wrapper
  const canonical = await readCatalog();
  const wrapper = await readFile(path.join(DATA_DIR, 'public_copy.js'), 'utf8');
  // When the wrapper assignment payload is parsed
  const match = wrapper.match(/window\.__PUBLIC_COPY__\s*=\s*([\s\S]*?)\s*;?\s*$/);
  assert.ok(match, 'wrapper must assign window.__PUBLIC_COPY__');
  const payload = JSON.parse(match[1]);
  // Then both delivery formats contain identical data
  assert.deepEqual(payload, canonical);
});

test('static and Next consumers use the public copy catalog', async () => {
  // Given static and Next application source files
  const staticCandidates = [path.join(ROOT, 'index.html'), path.join(ROOT, 'app.js')];
  const nextCandidates = [path.join(ROOT, 'lib', 'site-data.ts'), path.join(ROOT, 'lib', 'public-copy.ts')];
  // When both consumer implementations are inspected
  const [staticSource, nextSource] = await Promise.all([readSources(staticCandidates), readSources(nextCandidates)]);
  // Then static code reads the browser global and Next code imports canonical JSON
  assert.match(staticSource, /window\.__PUBLIC_COPY__/);
  assert.match(nextSource, /(?:import|require)[\s\S]{0,160}public_copy\.json/);
});
