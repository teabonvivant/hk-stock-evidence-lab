---
name: 港股證據研究室
description: A contemporary Hong Kong exhibition journal for evidence-led financial learning.
colors:
  primary: "#3538b8"
  primary-strong: "#272983"
  citron: "#e6ee92"
  bg: "#f2f1f7"
  bg-strong: "#e5e3f0"
  surface: "#ffffff"
  surface-soft: "#efedf8"
  ink: "#1b1c34"
  muted: "#55566b"
  line: "#d4d2e2"
  control-line: "#a4a0bb"
  placeholder: "#676477"
  on-primary-soft: "#e5e5ff"
  primary-divider: "#7476d5"
  accent: "#b45309"
  danger: "#b42318"
  success: "#18794e"
typography:
  display:
    fontFamily: '"Lab Serif", "Noto Serif HK", serif'
    fontSize: "clamp(42px, 4.3vw, 64px)"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0"
  headline:
    fontFamily: '"Lab Serif", "Noto Serif HK", serif'
    fontSize: "clamp(34px, 3.5vw, 50px)"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0"
  index-headline:
    fontFamily: '"Lab Serif", "Noto Serif HK", serif'
    fontSize: "clamp(40px, 5vw, 64px)"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0"
  reading-headline:
    fontFamily: '"Lab Serif", "Noto Serif HK", serif'
    fontSize: "clamp(36px, 4.2vw, 54px)"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0"
  section-headline:
    fontFamily: '"Lab Serif", "Noto Serif HK", serif'
    fontSize: "clamp(26px, 2.4vw, 34px)"
    fontWeight: 600
    lineHeight: 1.6
  article-title:
    fontFamily: '"Lab Serif", "Noto Serif HK", serif'
    fontSize: "25px"
    fontWeight: 600
    lineHeight: 1.65
  article-section:
    fontFamily: '"Lab Serif", "Noto Serif HK", serif'
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.65
  indicator-title:
    fontFamily: '"Lab Serif", "Noto Serif HK", serif'
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.6
  body:
    fontFamily: '"Lab Sans", "Noto Sans HK", sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  reading-body:
    fontFamily: '"Lab Sans", "Noto Sans HK", sans-serif'
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 2.1
  reading-intro:
    fontFamily: '"Lab Serif", "Noto Serif HK", serif'
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 2
  reading-deck:
    fontFamily: '"Lab Sans", "Noto Sans HK", sans-serif'
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 2
  summary:
    fontFamily: '"Lab Sans", "Noto Sans HK", sans-serif'
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 2
  label:
    fontFamily: '"Lab Sans", "Noto Sans HK", sans-serif'
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.65
  action:
    fontFamily: '"Lab Sans", "Noto Sans HK", sans-serif'
    fontSize: "14px"
    fontWeight: 600
  caption:
    fontFamily: '"Lab Sans", "Noto Sans HK", sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.9
  metadata:
    fontFamily: '"Lab Sans", "Noto Sans HK", sans-serif'
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.7
  code:
    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace'
rounded:
  square: "0"
  retained-card: "8px"
  panel: "12px"
  menu: "16px"
  pill: "100px"
spacing:
  compact: "12px"
  small: "16px"
  panel: "24px"
  roomy: "28px"
  block: "32px"
  section-mobile: "40px"
  broad: "48px"
  section: "60px"
  reading-gap: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-strong}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary-strong}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.surface}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary-strong}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "12px 20px 12px 0"
    height: "44px"
  button-warning:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
    height: "44px"
  cover-action:
    backgroundColor: "{colors.citron}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
    height: "50px"
  cover-action-hover:
    backgroundColor: "#f3fac0"
  cover-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
    height: "50px"
  reading-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "0.7rem 0.85rem"
    height: "50px"
  navigation-link:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 11px"
  navigation-link-current:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
  topic-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
    height: "44px"
  topic-link-current:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
  indicator-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
  evidence-figure:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "28px"
  direct-answer:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "1.15rem"
  policy-header:
    backgroundColor: "{colors.bg-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "44px"
  accountability-footer:
    backgroundColor: "{colors.ink}"
    textColor: "#d9d7ea"
---
# Design System: 港股證據研究室

## Overview

**Creative North Star: "The Hong Kong Exhibition Journal"**

A contemporary Hong Kong museum journal applied to financial learning. Ultramarine fields, lavender paper, midnight ink and a restrained citron accent give the library an authored identity. Locally served Hong Kong serif headlines carry the reading voice; measured sans-serif text keeps navigation, explanations and tools direct.

The system shifts density with the task: broad colour fields introduce a subject, open ruled rows support browsing, a bounded column supports sustained reading, and compact panels support calculation. Sources, teaching diagrams and qualifications retain their own meaning. Architectural imagery supplies atmosphere without standing in for market evidence.

This is the completed replacement visual system. The normative cascade is `app/globals.css`, `app/editorial.css`, `app/fonts.css`, then `app/atelier.css`. The frontmatter records shared as-built values; the sidecar carries responsive metadata, motion, depth and renderable component examples. The home composition is recorded in its surface brief and is not a template for every page.

**Key Characteristics:**
- Ultramarine and citron on cool lavender paper.
- Self-hosted Hong Kong serif headings and sans-serif reading text.
- Square editorial fields, softly cornered functional panels and pill actions.
- Open article rows, useful teaching geometry and clearly separated tool results.
- Sources and limitations remain available without repetitive production notices.

## Colors

The palette pairs a concentrated blue identity with cool, quiet reading surfaces and a light yellow-green accent.

### Primary
- **Ultramarine** (`primary`): the cover, shared primary actions, selected categories, evidence panels, results and keyboard focus. The existing `blue` CSS property is an alias of this value.
- **Deep ultramarine** (`primary-strong`): reading links, secondary actions and stronger text emphasis.
- **Pale text on ultramarine** (`on-primary-soft`) and **blue-field divider** (`primary-divider`): explanatory text and rules inside saturated panels.

### Secondary
- **Citron** (`citron`): the cover's main action, the editorial closing note, selection feedback and focus against dark or blue fields. It is an accent with dark text, not an information-status code.

### Neutral
- **Lavender paper** (`bg`): the page, masthead and mobile navigation ground.
- **Lavender wash** (`bg-strong`): square subject and policy headers, and selected mobile navigation.
- **White** (`surface`): fields, indicator panels, article figures and direct answers.
- **Soft lavender** (`surface-soft`): quiet tags, disclosures and supporting panels.
- **Midnight ink** (`ink`): main text, the footer and code surfaces.
- **Muted ink** (`muted`): summaries, labels and supporting prose.
- **Lavender rule** (`line`): dividers and quiet outlines. **Control stroke** (`control-line`) makes fields more distinct; **placeholder ink** (`placeholder`) keeps prompts legible.

The retained amber, danger and success variables support existing chart marks, warnings and research-status treatments. Those specialist states still carry their source-specific red, green and blue tints; they do not define the new editorial palette. Tonal ramps in the sidecar are generated preview metadata, not additional production colours.

**The Meaningful Color Rule.** Color supports a written label or explanation; it never establishes review, source quality or risk on its own.

## Typography

**Display Font:** Lab Serif, the local variable-font subsets of Noto Serif HK, followed by Noto Serif HK and serif fallbacks.

**Body Font:** Lab Sans, the local variable-font subsets of Noto Sans HK, followed by Noto Sans HK and sans-serif fallbacks.

**Code Font:** the existing system monospace stack recorded in the frontmatter.

Both Lab families are real bundled WOFF2 assets, split into core and extended Unicode ranges. Their normal variable face is declared for weights 100–900 with `font-display: swap`; the serif core is preloaded. `public/fonts/NotoSerifHK-OFL.txt` and `public/fonts/NotoSansHK-OFL.txt` retain the font licences. Preserve these declarations and coverage when adding Chinese content.

The serif is contemporary, spacious and literary; the sans is compact and practical. This is a role-based hierarchy rather than a uniform modular scale. Headline and title weights are generally 600; labels use 500; actions use 600; normal text uses 400. The masthead wordmark is the observed exception at 650.

### Hierarchy
- **Display:** the home cover's two-line invitation. Its maximum-width range and leading are recorded as `display`.
- **Headline:** subject introductions. The research index and long-form article have separate `index-headline` and `reading-headline` measures.
- **Section headline:** major page sections; `article-section` is the tighter long-form variant.
- **Title:** serif article rows and indicator panels. Featured reading uses a larger headline (clamp(28px, 3vw, 40px), 1.6 leading).
- **Body:** the shared sans base. Article prose uses `reading-body`; the serif opening and sans deck have separate roles. Summaries are compact and generously led.
- **Label and action:** search, filters, navigation and buttons. Cover actions are larger (15px); shared actions use the action role.
- **Caption and metadata:** supporting text stays distinct from headlines. Article metadata is plain text; a category does not become a repeated decorative eyebrow.

At 700px and below, the index headline becomes 42px, the article headline 32px with 1.6 leading, article prose 16px with 2 leading, the serif introduction 19px, article sections 25px, article row titles 24px, and page section headings 27px. Subject headlines become 32px and policy headlines 34px. The cover has its own responsive sequence described in Layout; do not apply its display sizing to tool controls.

**The Reading Hierarchy Rule.** Establish hierarchy with the title, introduction, section heading, body and caption. Put learning-step roles below their headings as plain text, and use numbering only when the order carries meaning.

## Layout

The shared shell is capped at 1320px. Its desktop width is the viewport minus 80px; at 1100px and below the clearance becomes 48px total, and at 700px and below 36px total. The masthead has an 80px minimum height, falling to 70px at 700px. Main content begins 32px below it on desktop and 18px on compact screens.

Use shrinkable grid tracks so Traditional Chinese can wrap naturally. Major section spacing is 60px, becoming 40px at 700px. Section-heading clearance is 28px, becoming 22px. Functional panel padding commonly uses 24px, 28px and 32px; broad subject panels use 44px before their compact adaptations.

The home cover is a square-edged, two-column field (1.2fr / 1fr), with a 560px minimum height and copy padding of 52px 48px. At 1100px it becomes 1.25fr / 1fr with a 510px minimum and 40px 32px copy padding. At 700px it stacks, with 38px 28px 40px copy padding and a photographic area of at least 250px with a 1.85 aspect ratio. At 400px the copy uses 32px 22px padding. The cover type follows these exact breakpoints:

| Viewport range | Cover headline |
| --- | --- |
| Above 1100px | clamp(42px, 4.3vw, 64px), 1.5 leading |
| 951–1100px | clamp(36px, 4.25vw, 47px), 1.5 leading |
| 701–950px | clamp(32px, 4.2vw, 40px), 1.5 leading |
| 401–700px | clamp(32px, 5.5vw, 43px), 1.55 leading |
| 400px and below | 29px, 1.55 leading |

The home observation rail has four columns, becoming two at 950px. The topic band has five columns, becoming two at 950px with the last topic spanning the row. Article rows use two columns with a 56px gap, reduced to 30px at 950px, then one column at 700px. The featured reading spans the full row and pairs text with its teaching figure; it stacks at 700px. Foundations use three, two and one columns across the same desktop, 950px and 700px ranges. Resource columns become a vertical sequence at 950px.

Research indexes and reading pages cap their outer measure at 1160px. A desktop reading page has a 200px contents column, a 740px reading column and a 64px gap, with the contents sticky at 112px. At 950px, the contents moves above the article and stops sticking; prose retains its 740px maximum. At 700px, the contents becomes a single-column list. Policy pages cap at 1080px, with a 780px section measure.

The six desktop navigation links disappear at 950px. The grouped menu remains available. At 900px and below, five fixed mobile destinations appear with safe-area clearance. The grouped menu has four columns, becoming two at 950px. Its label gives way to the menu icon at 620px. The calculator result moves below its fields at 950px; paired tool fields become single-column at 620px. Existing library and technical comparison layouts retain their 760px adaptations.

**The Content Measure Rule.** Give long articles a bounded reading measure; let research grids and comparison tools use the wider shell when the task needs it.

## Elevation & Depth

The replacement system is flat at rest. Paper, white, lavender and ultramarine planes, whitespace and fine rules supply hierarchy. The masthead and mobile navigation have no blur or shadow. Named research panels, indicator cards, calculation results and disclosures do not lift on hover. The grouped navigation is the deliberate floating exception.

### Shadow Vocabulary
- **Open navigation:** `0 18px 46px rgb(27 28 52 / .16)`, keeping the menu distinct from the page underneath.
- **Default shared surface:** `none`, matching the final shared shadow variable and the rewritten editorial panels.
- **Retained base card:** `0 10px 28px rgba(15,35,55,0.05)`, still supplied by the underlying general Card primitive when no named editorial override applies.
- **Retained base button:** `0 8px 18px rgba(15,118,110,0.18)`, still supplied by the underlying Button primitive; shared site actions explicitly remove it. These compatibility styles are not the model for new editorial panels.

**The Flat Reading Rule.** Use section dividers and spacing inside an article; do not wrap every paragraph or evidence block in another raised card.

Motion is limited to state feedback and one photographic arrival. The cover image starts visibly at opacity .82 and scale 1.06, then reaches opacity 1 and scale 1 over 1.3s using cubic-bezier(.16, 1, .3, 1). This animation only runs when reduced motion is not requested. Card-background and topic-colour transitions use 180ms ease; the existing button feedback uses 150ms ease-out. Reduced motion turns smooth scrolling off and reduces non-essential duration to .01ms. Shared press/lift helpers no longer translate or scale; the underlying Button primitive retains its own active feedback.

## Shapes

Broad editorial colour fields remain square. Functional panels, fields, figures and the brand tile use the panel radius; floating navigation uses the menu radius; actions, categories and desktop navigation use the pill radius. Existing generic cards retain their smaller corner value when a named panel does not override it.

Thin rules organize article lists, evidence steps and quiet topic routes. Indicator panels are white and borderless, while the final two foundation entries deliberately become open ruled rows. This variation is a home-page composition, not a rule that every five-card group must imitate. Teaching figures retain their original geometry and a bounded, clipped frame.

## Components

### Buttons

Shared site actions use ultramarine primary, transparent outlined secondary, text-like ghost and the retained amber warning variant. They use pill corners, 12px 20px padding, 600 weight and the base 44px height. Ghost actions remove left padding. Primary hover deepens the blue; secondary hover adds white; ghost hover underlines. Disabled buttons remain semantically disabled and visibly dimmed.

The home cover uses citron with midnight text for its main action, and a pale outlined white-text secondary action. They have a 50px minimum height, 12px 22px padding and 15px text; at 700px they become 46px minimum, 11px 16px padding and 13px text. At 400px text is 12px and horizontal padding 14px. The main action lightens on hover; the secondary adds a lighter blue field. Plain tool actions have a 46px minimum height.

Global keyboard focus uses a 3px ultramarine outline with a 5px offset; the cover and footer use citron against saturated grounds. Navigation retains its more specific 2px outline and 2px offset. Preserve the underlying button's specific focus-ring and disabled behaviour.

### Inputs and category controls

Visible sans-serif labels sit above white fields with the panel radius, stronger control stroke, 50px minimum height and 0.7rem 0.85rem padding. Placeholder text and the blue caret remain visible. The library field changes its border to ultramarine on focus without a shadow.

Category controls are outlined pills with a 44px minimum target; selected and hover states use ultramarine and white. Counts are secondary, tabular figures. Article search and category selection reset pagination; the result count is announced through a status region. Preserve the clear-search action, useful empty state, current-page semantics and no-script route to the sitemap.

### Navigation

A compact sticky masthead contains the serif brand tile, sans-serif name, six primary routes and native `details` / `summary` for the all-pages menu. The desktop routes are 學習、指標百科、研究札記、策略方法、工具、關於. The five mobile routes are 首頁、札記、指標、工具、導覽.

Desktop current-page links are solid ultramarine pills. Hover uses lavender wash and deep blue text. Mobile current-page links use lavender wash with ultramarine text. Preserve named navigation regions, `aria-current="page"`, the skip link, menu dismissal after choosing a route, anchor clearance and safe-area padding.

### Indicator cards and learning paths

Indicator cards lead with a serif title, then plain difficulty/category pills, English name, summary, use tags and a descriptive learning link. The standard card is white, borderless and shadowless; its hover fill is pale lavender. Header padding is 28px 28px 16px and body padding 0 28px 28px; at 700px these become 24px 24px 14px and 0 24px 24px. Functional tags communicate actual categories or uses; they do not imply review approval.

Beginner steps show the heading first and the original step number and learning role below it as plain text. Preserve the teaching sequence: role, chart focus, use, misuse, market context, confirmation, invalidation and practice. Advanced detail can follow in native disclosures. Equations remain selectable and naturally wrapping; table or chart overflow remains usable when the comparison requires it.

### Articles and figures

Article rows are open, ruled entries with serif title, category and reading metadata, summary and a reading link. A reading page preserves breadcrumbs, title, deck, date, reading time, contents, prose, teaching figures, references and related reading. Source links and the consultation date remain visible. Related reading uses serif linked rows.

Article figures retain the original teaching SVGs, descriptive alternative text, captions and a labelled enlargement link. Their panel-radius white frame has no outer border or shadow; captions have a separating rule and 22px 26px padding, reduced to 18px on compact screens. Diagram marks explain actual concepts and calculations.

The cover asset is `public/art/architecture-cover-v2.webp` (1122 × 1402; 172890 bytes), with the exact generation prompt recorded in `public/art/architecture-cover-v2.webp.json`. It depicts fictional abstract architecture, not a named landmark or financial event. It is decorative with empty alternative text and `aria-hidden`; teaching imagery keeps meaningful alternative text. Desktop cropping uses 56% 46% positioning, changing to 50% 41% at 700px. Keep the original teaching SVGs and source data independent of this atmospheric cover.

### Research Status Banner

This retained optional primitive presents an explicitly supplied research status, its written explanation, method version, review date, author and reviewer fields, and a correction route. It uses a labelled aside, written metadata and a state tint with a left border. Its existence does not require a banner before every article; the current reading templates do not mount it.

Preserve honest unset values when evidence is absent. Do not infer review, author credentials, measured performance, approval or publication eligibility from a colour, a named field or this component's presence.

### Direct Answer And Key Takeaways

This labelled aside pairs a concise answer with up to three supplied takeaways. Its white panel, panel-radius corners and 1.15rem padding provide a quick orientation before detailed reading. The desktop grid uses 1.15fr / .85fr with an 18rem minimum for the takeaway column; it stacks at 900px. Decorative check icons accompany the text and are hidden from assistive technology. They summarize the provided answer and do not certify it.

### Evidence Pipeline

The reusable evidence figure is an ordered teaching sequence with a concise caption, written step titles and explanations. Step count follows the subject: the home observation rail has four steps, while the indicator overview has five. It is not a compulsory six-stage validation ledger.

In subject headers it uses an ultramarine panel, citron numerals, white headings, pale explanatory text and fine blue rules, with 28px padding reduced to 24px on compact screens. On the home page the same semantic figure becomes an open rail on paper, with blue serif numerals and quiet dividers. Preserve the caption, ordered list and instructional meaning.

### Accountability Footer

The midnight-ink footer connects the library to policies, data and backtesting methods, corrections, risk information and the content-error route. It includes the financial-education context and distinguishes historical performance and teaching examples from future results.

The desktop footer uses four columns with a 44px gap and 56px vertical padding. It becomes two columns at 1080px, briefly one at the retained 760px breakpoint, then the compact two-column grouping at 700px places the opening and closing blocks across both columns. Compact padding is 40px. Main labels are white, body text pale lavender, and hover/focus emphasis citron. This is a set of useful responsibility routes, not an invented author biography or assurance badge.

### Policy Page

Policy pages use breadcrumbs, a square lavender header, title, scope description, version and update date, followed by the direct answer, contents, readable policy sections, related policies and a correction prompt. The section sequence follows the actual policy content. Section IDs remain stable for navigation; generated decorative ordinal labels are absent.

The header uses 44px padding and a serif headline, reduced to 30px 24px padding at 700px. The contents has a quiet bottom rule and two columns, becoming one at 700px. Sections are open on paper with 30px vertical padding; headings use the serif hierarchy and body text retains 1.9 leading. Related policies and the correction panel remain functional routes. Do not convert missing responsibility evidence into an invented approval.

Print removes site navigation, footer, contents navigation, search and pagination while preserving reading content and figures. The cover prints with white ground and black text; article prose uses 12pt.

## Do's and Don'ts

### Do:
- **Do** extend the ultramarine, lavender-paper and citron identity using the documented Lab Serif and Lab Sans roles.
- **Do** shift density to suit reading, browsing or calculation while preserving the established content and behaviour.
- **Do** keep actions, labels, source links, text contrast and keyboard focus clear at every viewport.
- **Do** preserve distinctions between historical evidence, teaching examples and assumptions.
- **Do** retain raster provenance, font licences, meaningful figure descriptions and reduced-motion support.

### Don't:
- **Don't** use fake market charts, profit promises or invented human-review credentials.
- **Don't** treat a status colour, check icon or high backtest metric as proof of reliability.
- **Don't** turn article paragraphs into nested cards or repeat decorative category eyebrows.
- **Don't** add section numbers where there is no informative sequence.
- **Don't** use the fictional architectural cover as evidence of a real location, event or market result.