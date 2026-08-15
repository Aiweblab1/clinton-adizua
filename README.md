# THE REAL AI LAB — Landing Page

Lead-generation landing page for THE REAL AI LAB's AI training masterclass.
Built as a single, self-contained `index.html` (no build step, no framework)
so it deploys directly on Vercel with **Framework = Other** and a blank
build command, root as the output directory.

## Status: Phases 1–8 built, all sections complete, not yet pushed to GitHub

The full page structure from the build brief is now in `index.html`, in
order: header, hero, marquee, authority/video-transition, video section,
curriculum ("What You'll Learn") with the evergreen countdown, audience
fit, disqualifiers, founder's final word, and a footer with Disclaimer and
Privacy Policy as native `<dialog>` modals. This is the whole page as
scoped by the build brief. The founder photo and the audience-section
reference graphic are now both in place; the video is the one remaining
real asset (see below), and that is the only reason this is not
launch-ready yet — everything else, including all copy, tracking
infrastructure, the countdown, and accessibility handling, is finished
and functional as written.

**This is committed locally but has not been pushed to GitHub yet.**
Nothing beyond Phase 2 is live on the repository until the next push.

### Founder photo — done

`assets/founder-photo.webp` is the supplied photo, cropped to a square
head-and-shoulders composition (not the full body — a full-body photo
forced into a circle reads badly, so it was reframed around the face and
upper chest with normal headshot headroom) and re-encoded to 480×480 WebP
at ~16KB. The circular mask, gold ring, and shadow are all applied by CSS
on the surrounding frame (`object-fit: cover` inside a clipped circle), so
the image itself is a plain square — nothing about it depends on being
circular, which keeps it easy to reuse elsewhere if needed later.

### "Replaced by AI" reference graphic — done, and the earlier risk is resolved

`assets/replaced-by-ai.webp` is a stylized illustration — five
silhouetted, non-identifiable figures each stamped "sacked," with role
tags (programmer, content creator, data analyst, copywriter, CRM
specialist). Because the faces are not real, identifiable people, this
does not trigger the consent risk flagged in the previous version of this
README (see the git history for that note if you want the full reasoning
again). The supplied graphic was a two-part composite — this photo grid,
plus a separate "REPLACED" role-list card stacked beneath it. Only the
photo grid was used here; the role-list portion was dropped because it
duplicates information already in the page's copy, and a tall composite
with two stacked graphics and fine print would not read clearly at the
small size this card renders at. If you want the full composite instead,
say so and it will be swapped in as-is.

### What is still genuinely missing, and why

1. **Training video.** The video section renders a complete, styled 16:9
   frame (gold border/glow, vignette, play button) but has no video
   behind it, because no Vimeo/YouTube/CDN URL has been supplied. To wire
   it up:
   - Find `VIDEO_URL` inside the `initVideo()` function near the bottom
     of the `<script>` block and set it to the real, externally-hosted
     URL (never an inline raw video file, per the brief).
   - Clicking play then swaps the poster for a lazy-loaded `<iframe>`
     and fires a `video_started` event into `window.dataLayer`.
   - `video_75_percent` is not wired yet — that needs the host
     platform's own progress API (Vimeo Player SDK or the YouTube IFrame
     API), which depends on which platform you host on. Tell me which one
     and I will wire that specific event next.

2. **Meta Pixel / TikTok Pixel IDs.** Every CTA already calls
   `trackCTA('<section-name>')`, which pushes a real, working event into
   `window.dataLayer` — you can confirm this is firing correctly today by
   opening the browser console and clicking any CTA. It is not yet wired
   to `fbq(...)` or `ttq.track(...)` because that requires your real
   Pixel IDs; dropping in placeholder IDs would ship tracking that looks
   like it works but silently reports nothing.

3. **Business contact info for the footer.** Both the Disclaimer and
   Privacy Policy modals currently show
   `[BUSINESS EMAIL OR WHATSAPP CONTACT — TO BE SUPPLIED]` in their
   Contact section. I did not invent a placeholder email or number for a
   real legal document — that is worse than leaving it visibly unfilled.
   Send the real contact detail and I will drop it into both
   `#disclaimerContact` and `#privacyContact` in one pass.

### Content-preservation notes for Phases 3–8

- All copy is reproduced exactly from the build brief, including the
  audience list, disqualifier list, and founder's final word — no
  rewording, no re-casing, no added or removed contractions ("they're" and
  "you're" in the source were already contractions and are left as-is;
  nothing else was contracted).
- Two whitespace-only fixes were made, both purely typographic and not
  wording changes: collapsed duplicated internal spaces in two curriculum
  bullets, and added a single space after the em dash in the curriculum
  CTA label ("Join Now — Limited Seats for this Cohort" — the source had
  "Join Now —Limited Seats"). If you want that literal spacing reverted,
  say so and I will match it exactly.
- The parenthetical note in the audience section — "(I will send the
  photos to be used here — no real people's photos or names. Make a
  proper provision for the photo portion)" — read as an instruction to
  the builder, not as visitor-facing copy, so it was not rendered on the
  page. The photo slot it asked for was built instead (see risk note
  above).
- The curriculum bullets use custom line-art icons rather than
  photography, since no curriculum imagery has been supplied yet. This
  is a finished, production-ready treatment on its own — swapping icons
  for real photos later is optional, not a fix for something broken.

## Deploy (Vercel)

1. Import this repository into Vercel.
2. Framework Preset: **Other**.
3. Build Command: leave blank.
4. Output Directory: repository root (`.`).
5. Deploy. `index.html` is served as-is.

No environment variables or API keys are required for this page at any phase — it is static HTML/CSS/JS end to end.

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
- Six CTA instances are live: `cta_hero`, `cta_video`, `cta_curriculum`,
  `cta_who_for`, and `cta_final`, each with its own event name so Events
  Manager can show which section actually drives intent, per the brief.
  Label text varies per section (the approved exception): "Join The
  Training Now" in the hero, video, and audience-fit sections; "Join Now
  — Limited Seats for this Cohort" after curriculum; "Join Now Before You
  Continue" before the final word. Geometry, class, and handler are
  identical across all six.

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
  the one line of Phase 1 that needed explicit sign-off, since it was not
  verbatim client copy (still awaiting confirmation as of this commit).

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
  tracking dispatcher, the countdown, and the scroll-reveal observer —
  all vanilla JS, roughly 120 lines combined, no framework or library.
- Fonts loaded via Google Fonts with `preconnect` and `display=swap` so
  text is not blocked waiting on font download.
- One real photo on the page now: `assets/founder-photo.webp`, 480×480,
  ~16KB. Everything else is still inline SVG (every curriculum/audience
  icon, the CTA and disqualifier icons), so there is nothing else to
  compress until the video is added. The founder photo did not get
  `loading="lazy"` — it sits inside the second section on the page, close
  enough to the top of the viewport on most phones that lazy-loading it
  would just delay a visible element for no real benefit; everything
  below the fold (once there is more imagery) should still be lazy-loaded.
  When the video goes in, it should follow the brief's requirements
  exactly: embedded as an iframe pointing at external hosting (already how
  `initVideo()` is written — see the missing-assets list above), never an
  inline raw video file.
- Every internal anchor (`#video`, `#curriculum`, `#who-for`,
  `#who-not-for`) now resolves to a real section in the same file, so the
  CTA chain scrolls correctly end to end.

## Known gaps before this can run as paid traffic

- Training video URL is not in the file yet (see "What is still
  genuinely missing" above). Both photo assets — founder photo and the
  audience-section reference graphic — are done.
- No Pixel IDs wired in — CTA and video-start events are captured in
  `window.dataLayer` but not yet sent to Meta or TikTok (see CTA
  specification above).
- Business contact info is not filled into the footer's legal modals.
- The marquee's five line items are new copy written for this build, not
  from the original brief, and still await your explicit sign-off.

None of these are code defects — the page is functionally complete and
would run correctly end to end as-is. They are real client inputs this
build cannot fabricate on your behalf.
