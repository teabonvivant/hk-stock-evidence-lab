---
name: "港股證據研究室"
description: "A Hong Kong financial reference library for evidence-led technical-analysis learning."
colors:
  primary: "#185bd1"
  primary-strong: "#164da8"
  navy: "#10263f"
  navy-active: "#233e5f"
  bg: "#ffffff"
  bg-strong: "#edf2f7"
  surface: "#ffffff"
  surface-soft: "#f5f7fa"
  ink: "#13243a"
  muted: "#536174"
  line: "#dfe5ec"
  field-border: "#a9b8ca"
  focus: "#3479eb"
  accent: "#b45309"
  blue: "#2563eb"
  danger: "#b42318"
  success: "#18794e"
typography:
  display:
    fontFamily: "\"Lab Sans\", \"Noto Sans HK\", \"PingFang HK\", \"Microsoft JhengHei\", sans-serif"
    fontSize: "36px"
    fontWeight: 750
    lineHeight: 1.45
    letterSpacing: "0"
  home-title:
    fontFamily: "\"Lab Sans\", \"Noto Sans HK\", \"PingFang HK\", \"Microsoft JhengHei\", sans-serif"
    fontSize: "34px"
    fontWeight: 750
    lineHeight: 1.5
    letterSpacing: "0"
  headline:
    fontFamily: "\"Lab Sans\", \"Noto Sans HK\", \"PingFang HK\", \"Microsoft JhengHei\", sans-serif"
    fontSize: "25px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0"
  title:
    fontFamily: "\"Lab Sans\", \"Noto Sans HK\", \"PingFang HK\", \"Microsoft JhengHei\", sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.55
    letterSpacing: "0"
  body:
    fontFamily: "\"Lab Sans\", \"Noto Sans HK\", \"PingFang HK\", \"Microsoft JhengHei\", sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  reading:
    fontFamily: "\"Lab Sans\", \"Noto Sans HK\", \"PingFang HK\", \"Microsoft JhengHei\", sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.85
  reading-compact:
    fontFamily: "\"Lab Sans\", \"Noto Sans HK\", \"PingFang HK\", \"Microsoft JhengHei\", sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.85
  label:
    fontFamily: "\"Lab Sans\", \"Noto Sans HK\", \"PingFang HK\", \"Microsoft JhengHei\", sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.8
  navigation:
    fontFamily: "\"Lab Sans\", \"Noto Sans HK\", \"PingFang HK\", \"Microsoft JhengHei\", sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.65
  button:
    fontFamily: "\"Lab Sans\", \"Noto Sans HK\", \"PingFang HK\", \"Microsoft JhengHei\", sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
rounded:
  control-sm: "6px"
  field: "7px"
  button: "8px"
  search: "9px"
  group: "10px"
  panel: "12px"
  pill: "9999px"
spacing:
  2xs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  2xl: "28px"
  3xl: "32px"
  section: "42px"
  reading-gap: "60px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "8px 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-strong}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "8px 16px"
    height: "44px"
  button-ghost:
    textColor: "{colors.muted}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "8px 16px"
    height: "44px"
  button-warning:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "8px 16px"
    height: "44px"
  reading-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "0.7rem 0.85rem"
    height: "46px"
  navigation-link:
    textColor: "#dfe8f4"
    typography: "{typography.navigation}"
    rounded: "{rounded.control-sm}"
    padding: "10px 13px"
  topic-link:
    textColor: "{colors.ink}"
    typography: "{typography.navigation}"
    rounded: "{rounded.field}"
    padding: "0.6rem 0.9rem"
  article-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
  evidence-figure:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.group}"
    padding: "21px"
  article-contents:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0 0 0 22px"
    width: "240px"
---

# Design System: 港股證據研究室

## Overview

**Creative North Star: "The Financial Reference Library"**

A practical Hong Kong financial reference library: white reading surfaces, light-gray grouping, navy navigation and restrained blue controls. Self-hosted Chinese sans-serif type supports scanning, comparison and sustained study. Borders, alignment and informative illustrations carry the visual identity.

The approved reference world draws on TradingView indicator cards, StockCharts ChartSchool reading structure and Futu Chinese article cards. The prior purple museum-journal direction, serif display voice and architecture cover are rejected. The replacement changes presentation while preserving the 100 articles, 82 indicator records, 200 teaching figures, historical examples and calculation behavior.

The shipping cascade is `app/globals.css`, `app/editorial.css`, `app/fonts.css`, then `app/finance.css`. The final finance layer is authoritative where rules overlap. `app/atelier.css` is unimported archival source and supplies no current design tokens. The approved homepage composition remains in its surface brief; it is not a required template for every route.

**Key Characteristics:**
- White surfaces and light-gray groups with a navy navigation frame.
- Self-hosted Lab Sans / Noto Sans HK across headings, reading and controls.
- Illustrated article cards with the title before category and reading metadata.
- A bounded reading column with a right-hand contents rail that collapses on smaller screens.
- Real sources, explicit limitations and functional educational tools.

## Colors

The palette is cool, quiet and functional. The frontmatter contains the normative values; source custom-property names are retained wherever available.

### Primary
- **Reference Blue** (`primary`): search submission, principal actions and selected controls.
- **Deep Reference Blue** (`primary-strong`): text links, hover emphasis and important control text.
- **Focus Blue** (`focus`): the general keyboard outline, three pixels with a four-pixel offset. Navigation and the shared Button retain their more specific focus treatments.

### Secondary
- **Navigation Navy** (`navy`): sticky masthead and calculation results.
- **Active Navy** (`navy-active`): navigation hover, focus and current-page background.
- **Amber / Information Blue / Error Red / Confirmation Green** (`accent`, `blue`, `danger`, `success`): retained semantic states. Pair them with written explanations; these are not extra decorative accents.

### Neutral
- **White Ground and Surface** (`bg`, `surface`): page and card backgrounds.
- **Cool Gray Ground** (`bg-strong`) and **Soft Gray Surface** (`surface-soft`): grouping, filter areas, teaching sequences and the footer.
- **Navy Ink** (`ink`): body text and headings; **Slate Text** (`muted`): summaries, captions and metadata.
- **Quiet Divider** (`line`): card frames and rules; **Field Stroke** (`field-border`): input boundaries and article-card hover borders.

**The Meaningful Color Rule.** Color supports written labels and state; it never establishes review, reliability or risk on its own.

## Typography

**Display and Body Font:** self-hosted Lab Sans, the project's Noto Sans HK family, followed by Noto Sans HK, PingFang HK, Microsoft JhengHei and sans-serif fallbacks.
**Code Font:** SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace.

The finance layer aliases the legacy `--reading-serif` name to `--font-sans`; this name does not authorize serif type. Lab Serif font-face declarations remain available in the font file but are not the current heading or reading voice. The root layout preloads the core Lab Sans font; supplied font licences remain with the assets.

### Hierarchy
- **Display:** article and index headings use the display token; compact screens reduce them to 28px with 1.5 leading.
- **Home title:** 34px at wide widths, 30px at 1100px and 27px at 620px; this is a compact introduction, not a promotional display.
- **Headline:** section and article subsection headings use 25px; compact article headings become 23px and homepage section headings 22px.
- **Title:** illustrated-card titles remain 20px on desktop and mobile, with 700 weight and comfortable multiline leading.
- **Body:** UI and summaries use 16px. Article-card summaries use 1.8 leading.
- **Reading:** prose uses 18px and 1.85 leading, reducing to 17px at 620px. Article decks use 18px/1.8 and become 17px on mobile.
- **Label and navigation:** metadata and captions use 14px; principal navigation uses 15px and reduces to 14px at 1100px.
- **Numerals:** reading metadata and calculation results use tabular numerals. Evidence-sequence numerals retain a monospace role.

**The Title First Rule.** Lead cards with their subject title. Put category and reading metadata beneath it; use numbers only when their order teaches something.

## Layout

The site shell has a maximum width of 1240px. Its total horizontal subtraction is 64px above 999px, 40px at 999px and 32px at 620px. The sticky masthead is at least 76px high, reducing to 66px on mobile. Main content uses 30px top and 64px bottom padding, becoming 22px and 38px at 620px.

Library cards form three columns, two at 999px and one at 620px. Wide article-grid gaps are 24px, then 18px at 1100px and 20px in the single-column layout. Topic links occupy five equal columns on wide screens and become a horizontally scrollable strip on mobile. Search, indicator shortcuts and categories remain working routes and controls.

Reading pages are bounded at 1100px. The content grid combines a 760px reading column, a 240px contents rail and a 60px gap. At 999px it becomes one column; the contents block moves above the article and prose retains its 760px limit. The rail defaults to expanded from 1000px and collapsed below it, and readers can toggle it at either size.

Related specialist breakpoints remain: tool layouts and the expanded navigation panel simplify at 950px; mobile bottom navigation appears at 900px; the footer becomes two columns at 1080px and one at 760px. Preserve bottom safe-area padding and all-navigation access.

Section rhythm uses 42px between major homepage sections, reduced to 30px on mobile. Article subsections use 36px above and 16px below their heading; paragraphs use 20px bottom spacing. These are contextual rhythms rather than a requirement to pad every element identically.

**The Reading Measure Rule.** Keep sustained prose within the reading measure while allowing libraries, comparisons and tools to use the wider site shell.

## Elevation & Depth

The finance layer sets `--shadow: none`. Article cards, indicator cards, research panels, reading figures and calculator surfaces are flat; borders, tonal grouping and spacing establish separation. The expanded navigation panel alone uses the deliberate overlay shadow (`0 14px 40px rgb(16 38 63 / .16)`).

The shared generic Button implementation still carries a legacy colored default shadow; this is recorded as implementation drift, not prescribed as the financial library's elevation language. Its four variants otherwise remain functional and are represented in the sidecar.

**The Flat Reading Rule.** Separate reading surfaces with spacing, borders and light-gray grouping. Reserve a diffuse shadow for the expanded navigation overlay; do not turn every paragraph into a raised card.

## Shapes

Panel and article corners use 12px; filter and teaching groups use 10px. Search surrounds use 9px, shared buttons 8px, fields and category routes 7px, and compact navigation or search-submit controls 6px. Retained informational badges are pills. One-pixel dividers and uncluttered rectangles carry the reference-library identity.

Illustrated cards crop their outer frame while their SVG thumbnail keeps its viewBox proportions. Article figures retain their complete image, caption and enlargement route. No atmospheric cover image is part of the current system.

## Components

### Buttons

Shared Buttons use a 44px minimum target, 8px corners, 14px semibold text and 8px/16px padding. Primary is blue with white text; secondary is white with an outlined border; ghost is quiet text with a soft hover surface; warning retains its semantic amber treatment. The small variant changes height to 36px while retaining the minimum target; the large variant is 48px with 16px text.

Hover changes color or border. Active uses scale(.98); disabled suppresses pointer events and uses .5 opacity. Shared Buttons use a two-pixel primary focus ring with a two-pixel background offset and 150ms ease-out state transitions. Reduced motion disables transitions and animations. The homepage search-submit control is the flat, 6px-corner variation with 15px text and 11px/22px padding.

### Inputs / Fields

Search and calculator inputs have visible labels, white fill, the field-stroke boundary, 7px corners and a 46px minimum height. Text is 16px and the caret is blue. The homepage search form provides its own visible group border and focus-within outline; its input's accessible label is visually hidden. It submits the real `q` query to the indicator library.

### Navigation

The navy sticky masthead uses light text and a darker-blue active surface. Expanded all-navigation content is a white, scrollable panel; its shadow indicates overlay depth. Current-page state is conveyed with `aria-current`. A fixed white mobile navigation bar retains clear selected state and safe-area spacing. Preserve the skip-to-main-content link.

### Chips / Category Routes

Article-category routes are outlined rounded rectangles with a pale-blue selected background and deep-blue text. Mobile targets reduce to 42px. Indicator badges retain written difficulty, category and usage labels with their existing semantic tints. Counts and filter values come from the content, not decorative sample data.

### Cards / Containers

Article cards have a one-pixel divider border and white surface. Each thumbnail is a compact rendering of that article's actual first teaching diagram; bar values come from data, and flow markers occupy a separate horizontal space from labels. Thumbnails are decorative duplicates, removed from the accessibility and tab order; the linked title supplies the destination.

The order is illustration, title, category, excerpt, then reading time and date. Titles are 20px; excerpts use 16px text with a three-line clamp. The footer has a dividing rule and tabular metadata. Card-body padding is 20px/22px/17px on wide screens, 18px at 1100px and 19px at 620px.

Indicator cards retain a title, difficulty/category metadata, English name and abbreviation, explanation, usage badges and a descriptive detail link. They use the same white panel language and a 20px sans-serif title. Preserve existing filters, empty results and reset actions.

### Reading Contents and Figures

The contents control is a labelled button with `aria-expanded` and `aria-controls`; its links preserve article section IDs. It is a right-hand sticky rail on desktop and a light-gray collapsible block above prose below 1000px.

Full teaching figures retain meaningful alternative text, caption, explanatory text and the enlargement link. Captions use 14px text and 1.8 leading. Source references, consultation dates and related reading remain accessible beneath the article.

### Research Status Banner

This retained optional primitive presents an explicitly supplied status, its written explanation, method version, review date, author and reviewer fields, and a correction route. It is a labelled aside with a status tint and a left border. The current homepage and article-reading templates do not mount it.

Preserve honest unset values when information is absent. The component does not prove completed review, author credentials, measured performance or publication eligibility. Its metadata grid adapts from five to three columns at 1080px and one at 760px.

### Direct Answer And Key Takeaways

This labelled aside pairs a supplied concise answer with up to three supplied takeaways. It is currently reused by policy pages, not required before every article. The retained pale confirmation tint and border identify orientation text; they do not certify the answer. Decorative check icons are hidden from assistive technology.

It uses panel corners, 1.15rem padding and a 1.15fr/.85fr desktop split with an 18rem minimum for the takeaway column. The layout stacks at 900px.

### Evidence Pipeline

The reusable evidence figure is an ordered teaching sequence with a concise caption, step titles and explanations. Step count follows the subject: indicator overview has five; other variants can have four. It is not a compulsory validation ledger and is not mounted in the current homepage introduction.

The current subject-header variant uses a soft-gray surface, ink headings, muted explanations, blue monospace numerals and fine separators. Padding is 21px, reducing to 17px at 620px. The ordered list remains two columns in the finance layer, including mobile. Preserve instructional order and written meaning.

### Accountability Footer

The footer connects the library to responsibility policies, data and backtesting methods, corrections, risk information and the content-error route. It includes the financial-education context and distinguishes historical performance and teaching examples from future results. It does not invent an author biography or assurance badge.

The current finance surface is light gray with ink-colored labels and muted body links, a top divider, a 32px column gap and 36px/42px vertical padding; compact values become a 28px gap and 28px/36px padding. The four-column layout reduces to two at 1080px and one at 760px. Preserve all routes and clear label contrast.

### Policy Page

Policy pages preserve breadcrumbs, title, scope description, version, update date, direct answer, contents, policy sections, related routes and a correction prompt. The obsolete category eyebrow is hidden by the editorial layer. Policy section IDs remain stable and decorative section ordinals are absent.

The page is bounded at 960px, with policy sections bounded at 760px. White framed panels use 12px corners and no shadow. Titles use 34px, becoming 28px on mobile; section titles use 25px and body text 17px/1.85. Header padding remains the supplied responsive clamp of 1.25rem to 2rem.

Print removes the site navigation, footer, article contents, search controls and pagination while preserving reading content and figures. Print prose uses 12pt.

## Do's and Don'ts

### Do:
- **Do** use the white, light-gray, navy and blue palette with the documented Lab Sans roles.
- **Do** preserve real article metadata, indicator filters, query parameters, source links and calculation behavior.
- **Do** keep the article title before its category; use each article's own diagram data for its thumbnail.
- **Do** keep numbered diagram markers visibly separate from their labels and preserve full figures in the article.
- **Do** provide clear focus states, meaningful figure descriptions, mobile wrapping and reduced-motion support.
- **Do** preserve the distinction between historical observations, teaching examples, assumptions and review status.

### Don't:
- **Don't** reintroduce the rejected purple/serif museum-journal world or architecture hero.
- **Don't** replace explanatory thumbnails with fabricated market feeds, returns or unrelated decoration.
- **Don't** infer author credentials, completed review or investment suitability from a badge or component.
- **Don't** add decorative eyebrows or section numbers that do not convey subject or sequence.
- **Don't** promote inherited styling defects or unimported archival CSS into the shipping design system.

Not canonized: the legacy generic Button's colored shadow is source drift, not reusable visual rules. Documentation does not repair source files.
