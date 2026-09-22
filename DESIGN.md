---
name: 港股證據研究室
description: Calm, evidence-led Hong Kong technical-analysis reading and learning.
colors:
  primary: "#0f766e"
  primary-strong: "#115e59"
  ink: "#0b1f33"
  bg: "#f7f8fa"
  bg-strong: "#e9eef3"
  surface: "#ffffff"
  surface-soft: "#f7f8fa"
  muted: "#334155"
  line: "#e9eef3"
  accent: "#b45309"
typography:
  headline:
    fontSize: "clamp(2rem, 4vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0"
  article-title:
    fontSize: "1.4rem"
    fontWeight: 700
    lineHeight: 1.65
  article-section:
    fontSize: "1.65rem"
    fontWeight: 700
    lineHeight: 1.65
  body:
    fontFamily: '"Noto Sans HK", "PingFang HK", "Microsoft JhengHei", system-ui, sans-serif'
    fontSize: "1.125rem"
    lineHeight: 2
  label:
    fontSize: "0.9375rem"
    fontWeight: 600
  caption:
    fontSize: "0.875rem"
    lineHeight: 1.85
rounded:
  field: "5px"
  action: "6px"
  card: "8px"
  navigation: "10px"
  panel: "12px"
spacing:
  compact: "0.75rem"
  standard: "1rem"
  panel: "1.5rem"
  section: "2rem"
  column: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "0.5rem 1rem"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "0.5rem 1rem"
    height: "44px"
  button-warning:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "0.5rem 1rem"
    height: "44px"
  button-ghost:
    textColor: "{colors.muted}"
    rounded: "{rounded.card}"
    padding: "0.5rem 1rem"
    height: "44px"
  reading-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0.7rem 0.85rem"
  navigation-link:
    textColor: "{colors.muted}"
    rounded: "{rounded.navigation}"
    padding: "0.7rem 0.6rem"
  topic-link:
    textColor: "{colors.ink}"
    rounded: "{rounded.action}"
    padding: "0.6rem 0.9rem"
  section-card:
    backgroundColor: "rgb(255 255 255 / 0.9)"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "1.25rem"
  evidence-figure:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "1.5rem"
---

# Design System: 港股證據研究室

## Overview

**Creative North Star: "港股證據研究室"**

A calm, evidence-led Hong Kong technical-analysis reading library. Navy ink, teal guidance, pale paper and restrained line geometry connect the established research tools with the expanded article collection. The voice is practical, measured Hong Kong Chinese, with literary reading headings and direct learning actions.

The visual system makes explanations, examples, source material and operating limits easy to find. Historical observations and teaching examples remain distinguishable. Financial education carries meaningful risk and source context; professional presentation does not imply verified performance or named human review.

**Key Characteristics:**
- Navy and teal on pale paper.
- Serif reading headings with readable sans-serif body text.
- Flat article rows, clear diagrams and functional controls.
- Explicit sources and limitations without repeated production notices.

## Colors

The established palette uses deep navy for reading structure, teal for guidance and quiet neutral surfaces.

### Primary
- **Teal** (`primary`): primary actions, links and focus feedback.
- **Deep teal** (`primary-strong`): selected navigation, filters and stronger link emphasis.

### Secondary
- **Amber** (`accent`): caution and the existing warning-button variant. Risk and information components retain their established red and blue tints; their text must explain the meaning.

### Neutral
- **Navy ink** (`ink`): headings, primary text, evidence figures and the footer.
- **Paper** (`bg`, `surface-soft`): page and quiet utility backgrounds.
- **Slate wash** (`bg-strong`, `line`): restrained grouping and existing default borders.
- **White** (`surface`): inputs, article figures and raised navigation.
- **Muted ink** (`muted`): descriptions and supporting text.

**The Meaningful Color Rule.** Color supports a written label or explanation; it never establishes review, source quality or risk on its own.

## Typography

Reading headings declare Noto Serif HK, Noto Serif TC and Source Han Serif TC as their preferred family sequence. Body text uses the existing sans-serif stack. These are CSS family preferences, not a claim that font files are bundled or that every device renders the same face. Legacy display fallbacks are not a reusable design choice.

The article headline, list title, section heading, body and caption roles are recorded above. Reading headings use a confident bold weight and natural Chinese wrapping. Article introductions are slightly larger serif text (1.25rem, line height 2). Standard explanatory copy varies with context; the larger article body is deliberately separate from compact controls.

At compact widths (620px and below), article headlines become 2rem, body copy becomes 1.0625rem with a 1.95 line height, and article section headings become 1.45rem. Do not apply this reading scale indiscriminately to the existing comparison tables and research tools.

**The Reading Hierarchy Rule.** Use title, introduction, section heading, body and caption to establish hierarchy; repeated decorative category labels do not add another level.

## Layout

The shared shell remains capped at 1240px with one-rem outer clearance on each side. Below 760px, the total horizontal clearance becomes one rem. Grid tracks use `minmax(0, 1fr)` or an equivalent shrinkable content track so Traditional Chinese can wrap naturally.

Article pages use a 220px contents column beside a reading column capped at 760px, separated by a three-rem gap. At 950px and below, the contents move above the article and stop sticking. Article lists use two columns, becoming one at 620px. Figures stay within the reading measure and open a larger original through an explicitly labelled link.

The home page places direct article and learning actions beside an explanatory figure, then offers a five-topic navigation band. This is a home-page composition, not a required layout for every surface. The band becomes two columns below 950px with its final topic spanning the row.

The desktop header shows six primary links and a grouped all-pages menu. At 900px and below, the primary links give way to a fixed five-tab mobile bar with safe-area padding; the all-pages menu remains available. The grouped menu changes from four columns to two below 950px.

**The Content Measure Rule.** Give long articles a bounded reading measure; let research grids and comparison tools use the wider shell when the task needs it.

## Elevation & Depth

The system combines flat reading surfaces, thin separating lines and restrained elevation for controls or outer containers. Article rows and the updated research hero are flat. Existing section cards keep their low-opacity white surface and soft shadow; the open navigation menu floats above the page.

- **Section card:** `0 10px 28px rgb(15 35 55 / 0.05)`.
- **Open navigation:** `0 18px 40px rgb(11 31 51 / 0.12)`.
- **Mobile navigation:** `0 -8px 24px rgb(11 31 51 / 0.08)`.
- **Primary button:** `0 8px 18px rgba(15,118,110,0.18)`.

**The Flat Reading Rule.** Use section dividers and spacing inside an article; do not wrap every paragraph or evidence block in another raised card.

## Shapes

Corners are restrained and functional: small field and action corners, slightly broader cards and navigation items, and the existing panel radius. Article figures use the card radius with a thin border; their captions sit below a dividing line. Existing informational badges remain rounded pills, while article metadata stays plain text.

Rules and line geometry organize content. Diagram marks communicate a concept, relation or measurement rather than serving as an ornamental market chart.

## Components

### Buttons

Compact, legible actions use the existing four variants: teal primary, bordered white secondary, amber warning and quiet ghost. Default height is 44px. Hover changes color or border; active state scales to 0.98. Existing transitions use 150ms ease-out. Preserve disabled semantics and visible keyboard focus. The reading tools also use a 46px plain button with the action radius.

### Inputs and topic links

Reading search, selection and tool fields have visible labels, white backgrounds, a clear border and a minimum 48px height. Topic links have a minimum 44px target and deep-teal selected state. Search and filters retain a visible result count, reset or pagination controls where supplied, and a useful empty result state.

### Navigation

The six desktop destinations are 學習、指標百科、研究札記、策略方法、工具、關於. The all-pages menu groups learning, methods, tools and site information in native `details`/`summary`. The mobile destinations are 首頁、札記、指標、工具、導覽. Current primary and mobile links use `aria-current="page"` and visible emphasis. Preserve the skip link, named navigation regions, sticky-header anchor clearance and safe-area padding.

### Article lists and reading pages

Article entries use category metadata, serif title, a short summary and a reading link, separated by thin rules. A reading page contains breadcrumbs, title, deck, date and reading time, contents, prose, diagrams, references and related reading. Category metadata is useful once in its intended context; it is not a decorative eyebrow above each visual.

Figures have descriptive alternative text, a caption and a labelled enlargement action. The illustration title and numbered caption explain the figure without adding a second category label or ornamental top rule. References are visible links with a recorded consultation date.

### Evidence and learning components

The shared evidence figure uses a navy field, a concise heading and numbered explanatory rows. Row count follows the subject; the current home figure has four steps. The original six-stage ledger is not a universal requirement.

Retain the established beginner order: role, chart focus, use, misuse, market context, confirmation, invalidation and practice. Advanced formulas and comparisons can follow in native disclosures. Equations remain selectable and naturally wrapping; historical charts retain adjacent data-source and limitation text. Tables can scroll where their comparisons require it. Input outcomes, errors and risk states need explicit text.

### Sources, policies and footer

The navy footer gives routes to policies, methods, corrections and risk information. Policy pages use readable headings, article sections and useful version or scope information. Sources and limitations stay close to the claims they qualify.

Research status is contextual evidence, not a compulsory banner before every article. Do not infer publication indexing from the presence of a named reviewer, or require blanket draft notices on public pages. Any statement of human review, credentials, legal approval, measured performance or responsibility must be supported. Missing evidence is described where it affects understanding; it is never replaced by an invented approval.

### Interaction and print

Motion is brief and functional: button feedback and stateful disclosure chevrons. The existing reduced-motion rule disables smooth scrolling and non-essential transition or animation duration. Global keyboard focus uses a teal outline; existing components retain their more specific focus rings. Print removes site navigation, footer and article controls while keeping the reading content and figures usable.

## Do's and Don'ts

### Do:
- **Do** extend the navy, teal and pale-paper identity with source-led reading content.
- **Do** keep actions, labels, text contrast and keyboard focus clear at every viewport.
- **Do** preserve distinctions between historical evidence, teaching examples and assumptions.
- **Do** keep references, risk limits and correction routes available without repetitive production commentary.

### Don't:
- **Don't** use fake market charts, profit promises or invented human-review credentials.
- **Don't** treat status color or a high backtest metric as proof of reliability.
- **Don't** turn article paragraphs into nested cards or repeat decorative category eyebrows.
- **Don't** make obsolete draft banners or reviewer-based indexing gates part of the visual system.
