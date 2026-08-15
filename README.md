# THE REAL AI LAB — Landing Page

Lead-generation landing page for THE REAL AI LAB's AI training masterclass.
Built as a single, self-contained `index.html` (no build step, no framework)
so it deploys directly on Vercel with **Framework = Other** and a blank
build command, root as the output directory.

## Status: Phase 1 of a multi-phase build

This repository currently contains **only** the header, hero section, and
moving marquee strip. Nothing else has been built yet. The remaining
sections (authority/video transition, video embed, curriculum, audience
fit, disqualifiers, founder's final word, footer with Disclaimer and
Privacy Policy, evergreen countdown, and Meta/TikTok Pixel wiring) are
intentionally not in this file yet — they are not stubbed out as empty
placeholders, they simply do not exist yet, so nothing in this build reads
as broken or unfinished. They will be added in later commits, phase by
phase, so each stage can be reviewed on a live Vercel preview before the
next one is built on top of it.

## Deploy (Vercel)

1. Import this repository into Vercel.
2. Framework Preset: **Other**.
3. Build Command: leave blank.
4. Output Directory: repository root (`.`).
5. Deploy. `index.html` is served as-is.

No environment variables or API keys are required for Phase 1.

## Color system (locked)

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#FAF8F3` | Primary background |
| `--ink` | `#14151A` | Primary text, marquee panel background |
| `--gold` | `#D9A441` | CTA fill, numbers, headline emphasis word |
| `--blue` | `#2F4FD6` | Small accent details only (marquee dots, spark icon) — never a large fill |

These four values are the only colors used anywhere in the file (opacity
variants of ink and paper are used for secondary text and overlays, but no
new hue is introduced). Any future phase must derive its colors from this
same set.

## CTA specification (locked, reused on every future button)

- Label text may vary per section; padding, font-size, border-radius,
  class name (`cta-button`), and click handler (`trackCTA`) must not.
- Padding: `1.05rem` vertical / `2.25rem` horizontal.
- Font-size: `1rem`, weight `600`.
- Border-radius: `10px`.
- Fill: gold, text: ink (this pairing clears WCAG AA contrast; gold with
  white or paper text does not, which is why the button text is dark, not
  light).
- Every click fires `trackCTA('<section-name>')`, which currently logs to
  `window.dataLayer`. This is real, working infrastructure — it is not
  wired to Meta Pixel or TikTok Pixel yet because that requires your real
  Pixel IDs. Send those and the next phase will replace the console/dataLayer
  call with actual `fbq('trackCustom', ...)` and `ttq.track(...)` calls.

## Content notes — what was preserved exactly, and what was a design choice

- The headline and all sub-point copy are reproduced exactly as written in
  the build brief, including capitalization and punctuation (for example,
  "just AI, the right prompts..." is left lowercase, matching the source).
  No contractions were added anywhere.
- Gold-highlighting "$1,000" in the headline is a visual styling choice,
  not a copy change.
- The five marquee line items (No Coding Experience Required, Built With
  Claude AI, Real $1,000 Client Result, the five skills taught, Step-By-Step
  System) are new copy, written for this phase because the brief calls for
  a marquee but does not supply its line items. This is the one piece of
  Phase 1 that needs explicit sign-off, since it is not verbatim client copy.

## Accessibility

- Skip link to main content.
- `prefers-reduced-motion` respected: hero entrance animation and marquee
  scrolling both disable, with the marquee falling back to a horizontally
  scrollable (not clipped) region so the content stays reachable.
- Marquee content is duplicated for the seamless loop; the duplicate copy
  is `aria-hidden="true"` so screen readers hear it once, not twice.
- Visible focus ring on the CTA (`:focus-visible`), 3px, in the blue accent
  so it is distinguishable from the gold fill.

## Performance

- No JavaScript framework; the only script on the page is the ~10-line CTA
  tracking dispatcher.
- Fonts loaded via Google Fonts with `preconnect` and `display=swap` so
  text is not blocked waiting on font download.
- No images in this phase, so there is nothing yet to lazy-load or compress
  — that requirement becomes active starting with the founder photo and
  video-frame phase.

## Known gaps (intentionally out of scope for Phase 1)

- No footer, no Privacy Policy, no Disclaimer yet — legally, this page
  should not run as paid traffic until those exist. Do not launch ads
  against this commit.
- No Pixel IDs wired in (see CTA specification above).
- The hero CTA currently anchors to `#video`, a section that does not
  exist yet in this file; it will resolve correctly once the video section
  is built in a later phase.
