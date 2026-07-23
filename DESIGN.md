# 港股證據研究室 Design System

## 1. Atmosphere & Identity

This site is a Hong Kong stock-market evidence laboratory: restrained, precise, openly versioned, and explicit about what remains unverified. The signature moment is a six-stage evidence ledger that traces raw data through formula, market regime, failure testing, out-of-sample review, and named responsibility. It replaces trading-desk photography, fake charts, profit arrows, and promotional performance tiles.

The public brand is **港股證據研究室｜HK Stock Evidence Lab**. The core promise is **不只看訊號，更要核對證據**.

## 2. Color

### Palette

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Background/base | `--bg` | `#f7f8fa` | Paper-like page background |
| Background/wash | `--bg-strong` | `#e9eef3` | Slate research wash |
| Surface/default | `--surface` | `#ffffff` | Cards, controls, panels |
| Surface/soft | `--surface-soft` | `#f7f8fa` | Subtle tile and input backgrounds |
| Text/primary | `--ink` | `#0b1f33` | Navy headings and important body copy |
| Text/muted | `--muted` | `#334155` | Descriptions, helper copy, metadata |
| Border/default | `--line` | `#e9eef3` | Cards, tables, dividers, controls |
| Accent/primary | `--primary` | `#0f766e` | Primary buttons, labels, focus border |
| Accent/strong | `--primary-strong` | `#115e59` | Active nav, key numbers, emphasis |
| Accent/warning | `--accent` | `#b45309` | Research-in-progress and caution states |
| Accent/info | `--blue` | `#2563eb` | Informational badges |
| Status/danger | `--danger` | `#b42318` | Error, rejected method, and risk surfaces |
| Status/success | `--success` | `#18794e` | Human-reviewed status only |
| Elevation/default | `--shadow` | `0 18px 44px rgba(11, 31, 51, 0.08)` | Page bands and elevated sections |

### Supporting Tints Already In Use

| Purpose | Values | Usage |
|---------|--------|-------|
| Teal research surfaces | `#f0fbf9`, `#ecfdf9`, `#edfdfa`, `#eefbf8`, `#cce5e1`, `#b7dfd9` | Review panels, trade panels, beginner cards |
| Amber caution surfaces | `#fffaf2`, `#fff7ed`, `#f3d7ad`, `#f59e0b`, `#9a3412`, `#7c3f00` | Notices, warnings, active utility states |
| Red risk surfaces | `#fff5f5`, `#f2c6c6`, `#991b1b` | Danger cards and invalid result states |
| Blue info surfaces | `#eaf1ff`, `#1e40af` | Informational badges |
| Neutral content text | `#334155`, `#2d3a45`, `#23424a` | Table body, nav links, dense list copy |

### Rules

- Teal means guidance or research quality; amber means caution or review needed; red means risk or invalid state; blue is reserved for factual info.
- New UI should use the existing custom properties first. When a tint is needed, reuse a supporting tint already documented above.
- Status color is never the only signal. Pair it with clear text such as "ready", "warning", or "missing".

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Page H1 | `clamp(1.65rem, 4.5vw, 3.4rem)` | inherited bold | `1.05` | `0` | Hero/page titles |
| Detail H1 | `clamp(1.85rem, 4vw, 2.75rem)` | inherited bold | `1.05` | `0` | Indicator detail headers |
| H2 | `clamp(1.2rem, 2.2vw, 1.65rem)` | inherited bold | normal | `0` | Section and panel headings |
| H3 | `1rem` | inherited bold | normal | `0` | Card headings |
| Body | browser default | normal | `1.72` | `0` | Paragraph copy |
| Small body | `0.86rem` | normal | context-specific | `0` | Dense cards, helper copy, result text |
| Caption/label | `0.72rem` to `0.78rem` | `800` to `900` | normal | `0.08em` for labels | Eyebrows, lesson labels, tile labels |

### Font Stack

- Primary: `"Noto Sans HK", "PingFang HK", "Microsoft JhengHei", system-ui, sans-serif`
- Mono: `"SFMono-Regular", Consolas, "Liberation Mono", monospace`

### Rules

- Body copy remains at readable browser-default size or `0.86rem` minimum for dense supporting content.
- Display text must not use negative letter spacing; the existing system keeps `letter-spacing: 0` except uppercase labels.
- Traditional Chinese content should be allowed to wrap naturally. Avoid fixed-width text boxes that create one-character or orphaned semantic fragments.

## 4. Spacing & Layout

### Base Unit

The implicit base unit is `4px`; most spacing resolves to multiples of `0.25rem`, `0.35rem`, `0.55rem`, `0.65rem`, `0.75rem`, `0.85rem`, `1rem`, `1.35rem`, and `1.5rem`.

| Token/Pattern | Value | Usage |
|---------------|-------|-------|
| `--radius` | `12px` | Cards, buttons, inputs, panels |
| `--max` | `1240px` | Main content width |
| Compact gap | `0.35rem` to `0.55rem` | Badges, labels, dense rows |
| Standard gap | `0.65rem` to `0.85rem` | Cards, stacks, form grids |
| Panel padding | `0.75rem` to `1rem` | Tiles, cards, result panels |
| Page band padding | `clamp(1rem, 2.5vw, 1.5rem)` | Major page sections |

### Grid

- Main shell: `width: min(var(--max), calc(100% - 2rem))`.
- Primary content grid: `minmax(0, 1.35fr) minmax(18rem, 0.65fr)`.
- Visual bands: `minmax(0, 1.15fr) minmax(17rem, 0.85fr)`.
- Card grids follow the content: the five-question homepage uses a deliberate `2 + 3` composition, trust entries use three columns, and research cards use two columns where evidence is dense.
- Breakpoints: desktop `1280px`, tablet `768px`, compact mobile `640px`, and narrow-mobile QA at `360px`.

### Rules

- Preserve dense but breathable layouts. This is an education workspace, not a marketing landing page.
- Use `minmax(0, 1fr)` on grid children to protect CJK wrapping and prevent overflow.
- New data panels should collapse to one column on mobile without horizontal scrolling except for tables.

## 5. Components

### Site Header

- **Structure**: desktop brand plus seven task-based links: 學習、指標百科、比較、港股實例、回測研究、工具、信任中心. Mobile uses a fixed five-item task bar.
- **States**: current links use `aria-current="page"` plus navy/teal emphasis; hover, active, and focus-visible states are distinct.
- **Accessibility**: preserve skip link, `aria-label` on brand/nav, and sticky header scroll offset.
- **Motion**: no decorative motion.

### Research Status Banner

- **Purpose**: state whether a page is 已核對、部分核對、研究中、不採用, or 已封存 before any claim.
- **Structure**: status label, plain-language meaning, method version, last review date, named responsibility or an explicit unresolved-person warning, and a report-error link.
- **Rules**: green is reserved for genuinely human-reviewed content. Missing named reviewers forces `研究中` and `noindex,follow`.
- **Accessibility**: status is always written in text; colour never carries the state alone.

### Direct Answer And Key Takeaways

- **Purpose**: answer the page's primary question in the first two screens.
- **Structure**: one 40–70 Chinese-character direct answer followed by no more than three takeaways.
- **Responsive**: answer precedes decorative or supporting visuals on mobile.

### Evidence Pipeline

- **Purpose**: replace fake-market hero photography with a transparent six-stage method diagram.
- **Structure**: raw data, formula and parameters, market regime, normal/failure pair, out-of-sample and costs, named review.
- **Surface**: deep navy field, paper ledger modules, restrained teal connectors, and subtle harbour-grid geometry made with CSS.
- **Accessibility**: semantic ordered list with a concise visible explanation; no canvas-only or image-only information.
- **Motion**: none.

### Accountability Footer

- **Purpose**: make responsibility and correction routes available on every page.
- **Structure**: trust-centre, editorial policy, data method, backtest method, AI disclosure, conflicts, corrections, risk disclosure, and report-error links.
- **Rules**: never invent a person, qualification, organisation, review date, or legal approval. Missing information is shown as missing.

### Policy Page

- **Purpose**: publish compact, versioned trust and method policies without decorative hero imagery.
- **Structure**: breadcrumb, status, H1, direct answer, version/effective-date row, table of contents, question-led sections, related policies, report-error link.
- **Responsive**: article width is `760px`; table of contents becomes a compact disclosure below `768px`.
- **Legal state**: privacy, terms, and risk language remain labelled as drafts and `noindex` until reviewed by a qualified Hong Kong professional.

### Page Band

- **Structure**: `.page-band`, optionally `.visual-band`, `.hero-grid`, `.content-grid`.
- **Spacing**: `clamp(1rem, 2.5vw, 1.5rem)` padding, `1rem` section rhythm.
- **Surface**: white alpha background, default border, and `--shadow`.
- **Accessibility**: sections with anchors use `[data-section]` scroll margin.

### Card Family

- **Structure**: `.indicator-card`, `.info-card`, `.comparison-card`, `.term-card`, `.review-panel`, `.trade-card`, `.danger-card`.
- **Variants**: neutral info, teal research/review, teal trade/action, red danger/risk.
- **States**: indicator cards gain teal border and stronger shadow on hover.
- **Accessibility**: cards should keep headings, labels, and lists in semantic order.
- **Surface**: 8px radius, 1px border, light shadow, gradient tone for semantic variants.

### Buttons

- **Structure**: `.button` with optional `.secondary`, `.ghost`, `.warning`.
- **States**: hover raises by `translateY(-1px)`; form controls have teal focus ring.
- **Accessibility**: use real `button` or `a href`; minimum height is about `2.55rem`.
- **Motion**: only transform motion is allowed.

### Chips, Badges, And Labels

- **Structure**: `.chip`, `.badge`, `.lesson-label`, `.eyebrow`.
- **Variants**: active chips, orange badges, blue badges.
- **States**: chips support hover/active teal tone.
- **Accessibility**: badges and labels summarize status; they should not carry meaning through color alone.

### Forms And Result Panels

- **Structure**: `.field`, `.select`, `.result-panel`.
- **Variants**: `.result-good`, `.result-warn`, `.result-bad`.
- **States**: inputs use teal border and soft focus ring; result panels use green/amber/red tint.
- **Accessibility**: error or warning panels must include explicit text.

### Tables And Lists

- **Structure**: `.score-table`, `.fact-list`, `.plain-list`, `.step-list`.
- **Responsive**: score tables may scroll horizontally on small screens.
- **Accessibility**: tables are for label/value evidence; lists are for procedural reading.

### Empty State

- **Structure**: `.empty-state`.
- **Surface**: dashed default border, translucent white background, centered copy.
- **Accessibility**: explain the next action in text and include a button when useful.

### Site Data Panels

- **Purpose**: reusable P1/P2 panels for generated site-data stats, research readiness, comparison coverage, market/evidence status, and review health.
- **Structure**:
  - Use `.site-data-panel` on the outer section or article.
  - Use `.site-data-grid` for metric groups.
  - Use `.site-data-metric` for a metric tile. `.site-data-card` is supported as a compatibility alias.
  - Use `.site-data-kpi` for the main number or short status.
  - Use `.site-data-label` for the metric explanation.
  - Use `.site-data-list` for label/value evidence rows.
  - Use `.site-data-status` with `.is-good`, `.is-warn`, `.is-bad`, or `.is-info` for compact status pills.
  - Use `.site-data-note` for cautionary source notes.
- **Variants**: default info, good, warning, bad, info status pills.
- **States**: static panels have no hover motion. If B renders links or buttons inside them, reuse existing `.button`, `.chip`, or `.badge`.
- **Accessibility**: status pills must contain readable text; metric tiles should use nearby headings or labels rather than anonymous numbers.
- **Motion**: none.

### Formula Evidence

- **Purpose**: distinguish a directly reproducible formula from a multi-step algorithm or a charting method before a learner treats it as a platform-ready rule.
- **Structure**: `.formula` holds the mathematical or procedural definition; `.formula-meta` states the calculation type and the warm-up, smoothing, data-source, or platform caveat.
- **Variants**: `可重現公式`, `可重現算法`, and `圖表方法，不是單一公式` are written as text, not colour-only states.
- **Accessibility**: preserve line breaks with `white-space: pre-wrap`; do not hide qualifications in a tooltip or visual-only badge.

### Teaching Charts

- **Purpose**: show a price example only when the local OHLCV snapshot matches the indicator's data needs; market breadth and options indicators show a data-requirement card until their own series is available.
- **Structure**: `.chart-shell` contains `.chart-viewport`, `.chart-scroll`, and the SVG; `.chart-data-requirement` replaces the price chart when the correct source data is unavailable.
- **Mobile state**: the chart stays horizontally readable at a stable intrinsic width and exposes a clear `放大圖表` command. Expanded charts close with the same command or `Esc`.
- **Accessibility**: SVG keeps an informative `role="img"` label; every chart source, status, and limitation is stated in adjacent text.

### Indicator Learning Header

- **Purpose**: replace the generic detail-page image with a compact orientation panel that states what the indicator measures, the market regime where it is most useful, and what it cannot prove.
- **Structure**: one title column plus a flat three-row evidence summary; the section navigation sits beneath the summary and links to chart, calculation, usage, and sources.
- **Variants**: core indicators carry a `核心 20 深度頁` status; non-core indicators carry a transparent `研究條目` status without implying that a dedicated chart has been validated.
- **Responsive**: two columns above `960px`, one column below. Navigation wraps without horizontal scrolling.
- **Accessibility**: section links use descriptive labels, visible focus states, and stable anchor targets.

### Indicator Library Controls

- **Purpose**: let learners narrow the 82-item library by query, category, difficulty, core status, and learning order.
- **Structure**: labelled search input, native select menus, a core-only checkbox, result count, and a clear-filter command.
- **States**: default, filtered, and no-results states. Filtering never hides the active result count or reset action.
- **Responsive**: four controls become a single column on mobile; labels remain visible rather than relying on placeholders.
- **Accessibility**: controls use native form semantics and a polite live result count.

### Indicator Evidence Blocks

- **Purpose**: make formulas reproducible and distinguish a signal from a complete trade decision.
- **Structure**: formula type, inputs, smoothing or warm-up rule, worked example, valid regime, failure example, related indicators, and visible research materials.
- **Surface**: use existing teal guidance, amber caution, and red risk tints. Evidence blocks inside a section remain flat and do not become nested cards.
- **Accessibility**: equations use selectable text with natural wrapping; source material is visible in the page rather than hidden in tooltips.

### Beginner Indicator Sequence

- **Purpose**: every indicator detail page must teach a repeatable order before showing formula or research depth: plain-language role, chart focus, simplest use, common misuse, market context, signal, confirmation, invalidation, and practice.
- **Structure**: three orientation blocks followed by a four-step numbered flow. The same structure is shared by all 82 indicators, while category and core-indicator copy changes the actual lesson.
- **Variants**: teal for the intended role, blue for where to look, amber for operating boundaries, and red for misuse or invalidation.
- **Accessibility**: steps remain semantic ordered lists; headings and explanations stay visible without hover or tooltip interaction.
- **Responsive**: three columns on wide screens, one column on mobile. CJK text wraps naturally inside `minmax(0, 1fr)` content columns.

### Advanced Disclosure

- **Purpose**: keep formula details and research comparisons available without placing advanced material before the beginner workflow.
- **Structure**: native `details` and `summary` using `.advanced-disclosure`, `.advanced-disclosure-icon`, and `.advanced-disclosure-body`.
- **States**: collapsed by default; opening rotates the chevron to communicate state and reveals the bordered body.
- **Accessibility**: native keyboard and screen-reader semantics are preserved; the summary has a visible focus ring and descriptive helper text.
- **Motion**: only the stateful chevron rotation uses the 150ms micro-interaction timing.

## 6. Motion & Interaction

### Timing

The existing stylesheet uses restrained CSS transitions by implication and small transform feedback. Any new motion should stay within these bounds:

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | `100ms` to `150ms` | `ease-out` | Button press, chip hover, focus feedback |
| Standard | `200ms` to `300ms` | `ease-in-out` | Panel reveal if one is introduced later |

### Rules

- Animate `transform` and `opacity`; avoid layout-changing animation.
- Do not add decorative animation to static education panels.
- Preserve `scroll-behavior: smooth` and the existing focus-visible treatment.
- If reduced-motion support is added later, disable non-essential transitions under `prefers-reduced-motion`.
- At `640px` and below, `.nav-links` becomes a visible three-column grid instead of relying on undisclosed horizontal scrolling.

## 7. Depth & Surface

### Strategy

The project uses a mixed strategy: soft borders for structure, low-opacity white surfaces for depth, teal/amber/red tonal gradients for meaning, and restrained shadows for elevated page bands and cards.

| Level | Value | Usage |
|-------|-------|-------|
| Flat tile | `1px solid var(--line)`, no large shadow | Audit/stat/data metric tiles |
| Card | `1px solid var(--line)`, `0 10px 28px rgba(15, 35, 55, 0.05)` | Repeated cards and panels |
| Elevated band | `var(--shadow)` | Major page bands |
| Hover emphasis | stronger teal border plus `0 16px 36px rgba(15, 35, 55, 0.08)` | Indicator cards only |

### Rules

- Keep nested data tiles flat when they sit inside a panel; avoid card-within-card visual weight.
- Use semantic surface tints instead of adding new shadows for status.
- Print styles remove decorative chrome and shadows; new panels should remain readable when printed.
