# Ground Station — visual direction redesign

**Date:** 2026-06-27
**Status:** Approved, ready for implementation plan

## Summary

Give the portfolio a distinctive visual identity without abandoning the macOS
liquid-glass feel the owner likes. The site keeps its glass surfaces and light
mode, but sheds the generic "AI blue" palette and flat all-`font-light`
typography in favor of a **graphite + amber** palette, a real type system
(Space Grotesk / Inter / JetBrains Mono), and restrained ground-station /
telemetry cues. Boldness is spent in exactly one place: the GitHub contributions
calendar, reframed as a live telemetry readout.

## Subject and goal

- **Subject:** Joshua Gottus (@jr-cho), SWE & Platform Engineer — embedded
  systems, autonomous platforms, cloud infrastructure; aerospace, real-time
  control, GitOps.
- **Page job:** convince a recruiter or collaborator, quickly, that the owner
  builds serious systems.
- **Direction:** "Ground Station" — Apple-clean light glass with the precision
  of an instrument readout. macOS feel stays; telemetry cues are restrained nods,
  not literal fake gauges.

## Decisions locked during brainstorming

1. Personality: instrument / telemetry, **restrained** (not full cockpit).
2. Mode: **light** primary, keep macOS liquid-glass surfaces.
3. Accent: **graphite + amber** — neutral graphite UI, amber only on the live
   data moment.
4. Type: **Space Grotesk** (display) + **Inter** (body) + **JetBrains Mono**
   (data labels).
5. Signature: **contributions calendar reframed as a telemetry readout**.

## Tokens — color

Defined in `src/index.css` `:root` (light) and `.dark`.

| Token | Light value | Use |
|---|---|---|
| background | `#F4F4F2` warm off-white | page background |
| ink / foreground | `#1C1C1E` graphite | text, UI, primary buttons |
| muted-foreground | `~#6B6B70` | secondary text, mono labels |
| hairline / border | `rgba(28,28,30,.12)` | rules, corner ticks, grid |
| **amber accent** | `#F5A623` | **only** the telemetry readout + `● LIVE` dot |
| glass surfaces | existing white glass | cards, navbar, dock — unchanged structurally |

Changes:

- Replace blue `--primary` (oklch 258°) with graphite `--primary`; primary
  buttons become graphite, not blue.
- Remove the purple/blue/cyan ambient blobs (`--blob-1/2/3`) and the
  `AmbientBackground` rainbow. Replace with either nothing or a very faint
  graphite grid/hairline texture.
- `--ring`, `::selection`, and other blue-derived accents move to graphite/amber.
- Amber is reserved exclusively for the signature readout and a single live
  status dot. It must not appear on generic buttons, links, or hovers.

Dark mode is retained but retuned to the same graphite + amber language (dark
graphite background, amber only on the readout). Light leads.

## Tokens — type

> **Design-review revision (2026-06-27):** Dropped Space Grotesk + Inter +
> JetBrains Mono. Space Grotesk read indie-quirky and fought the requested macOS
> calm; Space Grotesk + Inter were both grotesks with weak display/body contrast.
> macOS hierarchy is weight-driven within one family (the SF approach), so we use
> a single Geist superfamily.

Self-host via `@fontsource-variable/geist` and `@fontsource-variable/geist-mono`.
Wire into the Tailwind theme: `--font-sans` (Geist), `--font-mono` (Geist Mono).
No separate display face — hierarchy comes from weight + size.

| Role | Face | Treatment |
|---|---|---|
| Display + body | Geist (variable) | one family; headings `font-semibold` tight tracking, body normal/light. macOS-true, weight-driven hierarchy |
| Mono | Geist Mono | data labels, the telemetry readout, data tags; uppercase, tracked. Used sparingly |

Kill the current pattern of every heading being `text-2xl/3xl font-light`.
The hero name/tagline is the largest type on the page and decisively outranks
section titles.

## Structure — quiet everywhere except the signature

Keep the existing layout and the spacing work already merged (commit `612aee4`).
This is tokens + type + per-component polish, not a layout rewrite.

- **Section headers** (`SkillSection`, `ProjectSection`, `Stats`): a small
  **data-bearing** eyebrow (not decorative figure numbers) + Geist semibold
  title + hairline rule with corner ticks. Eyebrows encode truth:
  `12 TECHNOLOGIES`, `N PROJECTS`, `SINCE 20xx`. No heavy panels.
  - *Review fix:* rejected `FIG.01/02/03` — decorative numbering violates
    "structure = information."
- **Hero**: name in Geist at the largest size on the page (bigger than section
  titles); one mono micro-line beneath it carrying **real** info only —
  `SWE / PLATFORM · 2026` (no fake `● ONLINE` / `LIVE` status). Prose in Geist.
  Avatar + two buttons stay. Buttons: graphite primary + dashed outline.
  - *Review fix:* removed fake live-status dot — nothing is actually live; it
    contradicts the honest-telemetry premise.
- **Project cards**: keep glass + new padding; tech stack with a single mono
  `stack` label; graphite styling, no blue. Stronger shadow/border so white
  glass cards read as distinct surfaces against the warm-white background.
- **Dock / navbar**: stay glass. Active item uses `bg-foreground/10
  text-foreground` (graphite `bg-primary/10` was too faint to read as active).

### Mono restraint
Mono is reserved for: the telemetry readout, section eyebrows, and the card
`stack`/data tags. Not on year tabs, buttons, or prose — avoid the "technical
broadsheet" AI-template look.

## Signature — contributions as telemetry readout

The single bold element, and the ONLY place amber appears. Reframe the existing
`Stats` GitHub calendar:

- Mono framing: `● ACTIVITY · SIGNAL` (the one amber dot) on the left, the plain
  year `2026` on the right (not `REV.2026` — REV means revision, misleading to an
  engineering audience).
- **Amber as cell fills only.** Replace the green GitHub ramp with a graphite→
  amber ramp built from **solid lightness steps** (e.g. `#EAE3D2` faint →
  `#F0C46A` → `#F2B43E` → `#F5A623`), not opacity steps of one hue — alpha steps
  on translucent glass look muddy and low-contrast. The empty/level-0 cell stays
  neutral graphite with a clear gap before level-1.
- Total **counts up** via the existing `AnimatedNumber`. The number, label, and
  `↑` glyph are **graphite, not amber** — amber as text fails contrast
  (~1.9:1 on the light background). Amber stays on fills + the single dot.
- Hairline axis labels (M/W/F) and corner ticks on the glass card.

Uses real data already fetched — an honest signature, not decoration.

## Scope and non-goals

In scope:
- Color token overhaul (light + dark) in `src/index.css`.
- Font self-hosting + Tailwind font wiring; apply across components.
- Per-component polish: Hero, SkillSection, ProjectSection, ProjectCard, Stats,
  Footer, Dock/navbar color tokens.
- Signature build on `Stats`.
- Remove/retire ambient rainbow blobs (`AmbientBackground`, blob tokens).

Out of scope:
- Layout/spacing rewrite (already done).
- New pages or content/copy restructuring beyond the hero mono micro-line.
- Dropping dark mode (retained, retuned).

## Quality floor

- Responsive to mobile. **Amber never used as text** — fills/cells/dot only;
  all text is graphite/foreground (amber-on-bg fails WCAG ~1.9:1).
- White glass cards keep enough shadow/border to read as surfaces over the
  warm-white background.
- Instrument grid background stays subtle and must not smear/moiré through the
  glass `backdrop-filter`; verify on the live page (low opacity + top mask).
- Visible keyboard focus (graphite ring).
- `prefers-reduced-motion` respected for the count-up and any readout motion.

## Design-review log (2026-06-27)

Senior review before implementation flagged and resolved:
1. Fake `● ONLINE/LIVE` status → **removed** (dishonest).
2. Amber as text fails contrast → **amber on fills/dot only**, text graphite.
3. Amber ramp by alpha looked muddy → **solid lightness ramp**.
4. `FIG.0x` decorative numbering → **real-count eyebrows**.
5. `REV.2026` mislabel → **plain year**.
6. Two amber dots → **one** (readout only; hero dot removed via #1).
7. Space Grotesk fought macOS + weak pairing → **single Geist superfamily**.
8. Hero same size as section titles → **hero is largest type**.
9. White glass on warm-white vanished → **stronger card separation**.
10. Grid-through-glass noise → **verify subtle on live page**.
11. Mono creep → **mono scoped to readout + eyebrows + data tags**.
12. Faint dock active state → **`bg-foreground/10 text-foreground`**.
