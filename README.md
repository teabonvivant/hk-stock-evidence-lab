# 港股證據研究室

以香港繁體中文整理技術分析知識、圖表判讀與風險管理方法。

- 公開網站：https://teabonvivant.github.io/hk-stock-evidence-lab/
- 原有 Sites 網站：https://technical-indicators-hk.teabonvivant.chatgpt.site/
- 內容：100 篇研究札記、82 個技術指標、200 幅文章圖解，以及學習路線、策略方法與互動計算工具。

## 本機開發

使用 Node.js 24 和 npm。依賴版本由 `package-lock.json` 鎖定。

```sh
npm ci
npm run dev
```

頁面與互動元件位於 `app/`、`components/`，內容資料位於 `data/site/`，圖解及字體位於 `public/`。`references/`、`schema/` 與資料檔保留研究依據及資料結構。

## GitHub Pages

```sh
npm run build:pages
npm run test:pages
npm run preview:pages
```

預覽網址為 `http://127.0.0.1:4178/hk-stock-evidence-lab/`。公開輸出位於 `dist/client/`，含 227 個內容頁面、404 頁面、React 導覽資料、圖片、字體、RSS、XML 網站地圖與 `.nojekyll`。

推送至 `main` 後，`.github/workflows/pages.yml` 會檢查型別、內容、計算規則與匯出的連結及資源，再透過 GitHub Actions 發佈。GitHub 儲存庫的 Pages 發佈來源須設為 **GitHub Actions**。

`scripts/build-pages.mjs` 只在 Pages 建置期間設定子目錄網址。它亦包含 Vinext 0.0.50 預先產生頁面時遺漏 `basePath` 的版本限定相容修正，完成後會還原套件檔案；升級 Vinext 時需重新核對此處。RSS、XML 網站地圖及頁面標準網址會採用 GitHub Pages 網址。

## 驗證

```sh
npx tsc --noEmit
node --test tests/p0-contracts.test.mjs tests/calculations.test.mjs scripts/test_copy_integrity.mjs
npm run build:pages
npm run test:pages
```

Pages 審核會覆核 227 個頁面的標題、描述、標準網址、內部連結、章節錨點、圖片與文字替代、文章圖解數量、導覽資料，以及 CSS／JavaScript 資源路徑。新增內容頁面時，請一併更新 `lib/routes.ts` 與發佈審核清單。

原有 Sites 建置保留使用 `npm run build`；該建置完成後可執行 `npm test` 及 `npm run test:routes`，驗證伺服器版本。

## 內容與使用

文章的參考資料列於各篇文末；內容以金融教育及研究為目的。網站的編輯政策、數據方法、修訂紀錄及風險披露可從頁尾查閱。第三方資料與程式碼的原有署名、來源及授權要求仍然適用。
