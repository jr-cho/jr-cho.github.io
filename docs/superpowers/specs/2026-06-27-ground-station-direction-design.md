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

Self-host via `@fontsource` packages (Space Grotesk, Inter, JetBrains Mono).
Wire into the Tailwind theme: `--font-display`, `--font-sans`, `--font-mono`.

| Role | Face | Treatment |
|---|---|---|
| Display | Space Grotesk | headings + name; tight tracking; `font-medium`/`font-semibold` — real weight contrast |
| Body | Inter | prose, buttons |
| Mono | JetBrains Mono | data labels, section indices, readout axis, `REV.2026`; uppercase, tracked |

Kill the current pattern of every heading being `text-2xl/3xl font-light`.
Establish a clear scale where display headings decisively outrank body text.

## Structure — quiet everywhere except the signature

Keep the existing layout and the spacing work already merged (commit `612aee4`).
This is tokens + type + per-component polish, not a layout rewrite.

- **Section headers** (`SkillSection`, `ProjectSection`, `Stats`): small mono
  eyebrow + Space Grotesk title, e.g. `FIG.02 / PROJECTS`. Hairline rule with
  small corner ticks. No heavy panels boxing every section.
- **Hero**: name in Space Grotesk at real weight/size; one mono micro-line
  beneath it (`SWE / PLATFORM · REV.2026 · ● ONLINE`); prose in Inter. Existing
  avatar + two buttons stay. Buttons: graphite primary + dashed outline
  secondary.
- **Project cards**: keep glass and the new padding; tech stack rendered as mono
  tags; graphite styling, no blue.
- **Dock / navbar**: stay glass (this is the macOS feel). Only color tokens
  change.

## Signature — contributions as telemetry readout

The single bold element. Reframe the existing `Stats` GitHub calendar:

- Mono framing: `[ ACTIVITY · SIGNAL ]` on the left, `REV.2026` on the right.
- Amber on the hottest contribution cells; graphite ramp for the rest (replace
  the current green GitHub ramp).
- Total **counts up** using the existing `AnimatedNumber`, with an `↑` and a
  mono `contributions` label.
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

- Responsive to mobile; amber meets contrast on light glass for any text use
  (prefer amber on fills/cells, graphite for text).
- Visible keyboard focus (graphite ring).
- `prefers-reduced-motion` respected for the count-up and any readout motion.
