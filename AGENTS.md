# AGENTS.md — StatDoctor Marketing Site

A vendor-neutral guide for AI coding agents (Claude, GPT, Cursor, etc.) working in this repo. Read top-to-bottom before making changes.

---

## What this is

The marketing site for **StatDoctor** — Australia's first locum doctor marketplace. Two-sided: doctors and hospitals. The product is a mobile app; this site exists to drive doctor sign-ups and hospital onboarding.

Live at `statdoctor.app`. Production deploy is **Vercel**, watching the **`jasmine-frontend`** branch on the fork at `jasmineraj2005/statdoctor_frontend` (the `jasmine` remote in this clone). The upstream at `DrAnuG1995/website` (the `origin` remote) is **not** the deploy source — pushing to `origin/main` does not trigger a deploy.

To deploy: merge work into local `main`, then `git push jasmine main:jasmine-frontend`.

The category (locum doctor recruitment) is design-poor. Every competitor — Medrecruit, Wavelength, Blugibbon, Hopmedic, Locumate, Go Locum — is either a 2010s-era WordPress recruitment site or a flat B2B SaaS page. **The brief is to ship a genuinely well-designed motion-driven editorial site** that doesn't look like anything else in the category. That's the moat.

---

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | `app/` directory, RSC where possible, `"use client"` for motion |
| Language | TypeScript 5.5 | Strict mode |
| Styling | Tailwind 3.4 | Brand tokens extended in `tailwind.config.ts` |
| Motion | Framer Motion 11 | Default for all animation. GSAP is installed but rarely needed — prefer Framer |
| Smooth scroll | Lenis 1.1 | Wired via `LenisProvider` in `app/layout.tsx` |
| Maps | Google Maps JavaScript API (via `@googlemaps/js-api-loader` v2) | Hero map only. AdvancedMarkerElement for pins. See **Google Maps guardrails** below |
| Data | Supabase | Live hospitals + shifts (`lib/hospitals.ts`). Anon-key SSR fetch on home + realtime channel on the client |
| Deploy | Vercel | Watches `jasmine/jasmine-frontend`. See deploy note above |

No state library, no CSS-in-JS runtime, no UI-library components. If you want a primitive, build it.

---

## Brand palette — these four tokens, plus white

```
bone        #F5F1E8   Warm off-white / paper — accent surfaces, soft halos, active testimony card
ink         #1a1a2e   Primary text, dark surfaces, default border
electric    #cde35d   Lime accent — active states, highlights, that-one-thing-the-eye-lands-on
ocean       #3232ff   Brand blue — matches the StatDoctor app logo. Used for italic emphasis text, primary CTAs, FAQ tiles, hero card emphasis
ocean-soft  #7b7bf4   Lighter ocean for halos, tints, soft gradients
leaf        #2f8f6e   Muted medical green — used in FAQ tile rotation
muted       #6b7a73   Secondary text only — never as a fill or border
```

**Base background is white (`#ffffff`).** Bone is an accent, not a canvas. The minimalist white-page aesthetic is core to the redesign — do not flood the page with bone or any other colour. Use ocean and electric for emphasis and energy; let white do the work.

Legacy tokens still exist in `tailwind.config.ts` (`bone-2`, `gauze`, `parchment`, `ink-soft`, `electric-deep`, `light-blue`, `stat`) — these are **referenced by the older hospitals/partners/contact pages** which haven't been fully redesigned yet. **Do not use legacy tokens in new code.** Cleanup will happen page-by-page.

Typography (the site is **two fonts only** as of 2026-05-13):
- Display: **Cormorant Garamond** (italics used for emphasis lines). Loaded via Google Fonts in `app/globals.css` and exposed as the `display` font-family and `.display` class.
- Body / UI: **Inter**. Also used by the legacy `.mono` class.

Type tokens (lock these in for new sections — see `2026-05-13` decision log for the audit that established them):
- **H1 page hero**: `text-[clamp(40px,6.5vw,88px)] leading-[0.98]` (one token site-wide).
- **H2 primary section**: `text-[clamp(28px,4.5vw,56px)] leading-[1.0]`.
- **H2 secondary section** (smaller subhead under a marquee/intro): `text-[clamp(24px,3.6vw,44px)] leading-[1.05]`.
- **Eyebrow primary**: `text-[10px] tracking-[0.22em] uppercase text-muted`.
- **Eyebrow secondary** (chapter counters, sub-labels): `text-[11px] tracking-[0.18em] uppercase`.

There should only be two eyebrow tracking values in the codebase (`0.22em` / `0.18em`) outside of the `VideoSlot` dev component. If you find yourself reaching for `0.14em` / `0.25em` / etc., snap to the nearest token instead.

---

## Design direction

- **Motion-rich, editorial, scroll-driven.** Every section earns its place with motion.
- Apple-iPhone-style scroll-pinned chapters. Lyra Technologies-style sticky testimony reveal.
- Don't reference locum competitors as positive examples — they're the cautionary baseline.
- Reference library lives at `reference.md` — read it before suggesting design changes.

---

## File layout

```
app/
  layout.tsx            Root layout: Lenis + Cursor + Nav + Footer
  page.tsx              SSR shell — fetches hospitals/shifts/stats from Supabase, renders <HomeClient />
  HomeClient.tsx        Homepage sections (client component). Order: HeroMap → LiveStatsStrip → LogosStrip → FounderVideo → AppShowcase → NotAnAgency → HowWereDifferent → LiveShiftFeed → DoctorVoicesPinned → FAQGrid → StateHealthBand → FinalCTA
  not-found.tsx         Site-wide 404 — editorial "soon." treatment matching the /blog placeholder
  globals.css           Body bg, typography classes, Lenis CSS, marquee mask
  about/                Founder essay (Hero + 3-chapter Story + TravelAgentParallel + PullQuote + Closing)
  hospitals/            Hospitals landing — full redesign (city-slideshow hero, pricing, demo, FAQ)
  for-doctors/          Doctor funnel — full redesign (city-slideshow hero, AppShowcase, network grid)
  partners/             Doctor perks (CPD Home + Validex + etc.) — full redesign
  contact/              Contact form — legacy, pending redesign
  blog/                 PAUSED. /blog renders an editorial "soon." placeholder; /blog/[slug] inherits the global 404. Posts pipeline lives in a separate repo (STATDOCTOR_BLOGPOSTING).
  privacy-policy/       Legal — kept as-is
  terms-of-use/         Legal — kept as-is
components/
  Nav.tsx               Slim: logo + centered Doctors/Hospitals/Partners links + Login + Download App
  Footer.tsx            Editorial footer — every page link lives here now
  LenisProvider.tsx     Smooth scroll wrapper
  Cursor.tsx            Custom cursor (data-hover targets)
  CitySlideshow.tsx     Ken-Burns crossfade slideshow used as background on /hospitals + /for-doctors hero. next/Image-backed.
  DownloadModal.tsx     App-store / Play-store modal triggered by Nav "Download App"
  MagneticButton.tsx    Magnetic hover button (legacy pages still use it)
  SplitText.tsx         Per-character reveal — used on /blog (placeholder), legacy elsewhere
  Counter.tsx           Animated counter — used on LiveStats only. Removed from Partners hero (was too slow on small numbers).
  VideoSlot.tsx         Video frame — legacy, only used as a dev scaffold. The two outlier tracking values (0.25em, 0.3em) live here intentionally.
  LegalPage.tsx         Shared legal layout
  home/
    HeroMap.tsx         Google Maps AU hero. Teardrop SVG pins (logo in head). Elastic Australia bounds. Cooperative gesture handling so the map does NOT capture page scroll.
    hospitals.ts        Fallback hospital coordinates (used only if Supabase is empty)
    LiveStats.tsx       Aggregate metrics tile row (active shifts / confirmed / avg rate / total value)
    LiveShiftFeed.tsx   Real shifts pulled from Supabase. Realtime channel subscribed.
    AppShowcase.tsx     4-step phone-screens reveal driven by scroll progress
    AgencyCompare.tsx   Numbers-side comparison (legacy, not in current HomeClient flow)
    FeatureShowcase.tsx (legacy alt feature grid — not in current flow)
    HowWereDifferent.tsx Agency-vs-StatDoctor flow diagram (Hospital → Doctor pill chain)
    NotAnAgency.tsx     "We are not an agency" beat
lib/
  hospitals.ts          Supabase fetches: hospitals, shift counts, live shifts, live stats. Also state/suburb-extraction helpers.
  partner-logos.ts      Curated partner-logos marquee (used on home + /hospitals)
  hero-slides.ts        City-slideshow source list
  marketing-stats.ts    Curated marketing numbers (e.g. VERIFIED_DOCTORS, AGENCY_FEES_SAVED_AUD)
  blog/                 Blog data layer — kept while pipeline is paused
public/
  doctors/              Doctor headshots
  hospitals/            City photos for the CitySlideshow hero (17 cities, 1.5-3MB JPGs each — served via next/Image so they render as resized WebP/AVIF, not raw)
  screens/              Phone-screenshot PNGs for AppShowcase + Hospitals stacked-card
  partners/state-health/ Eight state/territory health-service logos (NSW, VIC, QLD, SA, WA, TAS, NT, ACT)
reference.md            Design inspirations + competitor URLs
scripts/                Local debug + screenshot scripts (Playwright). Not part of the build — safe to leave untracked.
```

Convention: components specific to one route live in `components/<route>/`. Shared primitives live at `components/` root.

---

## Google Maps guardrails

The site moved off Mapbox onto **Google Maps JavaScript API** (via `@googlemaps/js-api-loader` v2) because the brief wanted real logo-pin markers (AdvancedMarkerElement) and the Supabase-driven hospital list grew beyond the original 12-stop tour. The map is the **single most billable surface** on the site — treat it carefully.

Rules in this repo:

1. **One map per page load.** Only the homepage hero has a map. Don't add a second map anywhere — re-use the existing instance via refs if you need to drive it.
2. **Map ID is `DEMO_MAP_ID`** (a free Google-provided demo Map ID that enables vector rendering + AdvancedMarkerElement). Swap this for a production-owned Map ID via Google Cloud Console → Map Management if/when ops sets one up. Map styling can ONLY be configured via that Map ID — inline `styles` arrays are ignored by Google when a Map ID is set, so don't try.
3. **No Geocoding / Static Images / Directions / Places API calls.** Hospital coordinates come from Supabase. Marketing only needs the rendered map.
4. **AdvancedMarkerElement only.** Pins are teardrop SVGs built in `buildMarkerElement()` inside `HeroMap.tsx`. Logo loads from the hospital's `logo_url` (Supabase storage). Don't fall back to deprecated `google.maps.Marker`.
5. **`gestureHandling: "cooperative"`** — locked in 2026-05-13. The map must NOT capture page-scroll wheel events. Users zoom via the corner +/- buttons, ctrl/cmd+wheel, or pinch on touch. Don't restore `"greedy"` or re-introduce a custom wheel listener with `e.preventDefault()`.
6. **`restriction: { latLngBounds: AU_BOUNDS, strictBounds: false }`** — the elastic bounds keep the camera nudged into Australia without preventing the full continent from being visible at overview zoom. Don't flip to `strictBounds: true` (we tried — it cropped the view).
7. **Referrer allowlist matters.** The API key has a "Website restrictions" list in Google Cloud Console. Production domain must be added there; localhost:3000 is already in. If you ever start the dev server on a different port (3001 etc.), the map will fail with `RefererNotAllowedMapError` until you add it.
8. **Keys are in `.env.local`** as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. All three must also be set in the Vercel project settings for the live deploy.

---

## Conventions

- **No new dependencies without a reason.** The user explicitly wants a tight stack. If you're tempted to add a UI library, animation helper, or icon set, build it instead.
- **No comments unless the WHY is non-obvious.** Identifiers do the documenting. Don't write `// fetch the data` above a fetch.
- **Don't add backwards-compatibility shims.** If a section is removed, delete it — don't `_deprecated` it.
- **Match the editorial bar.** No stock illustrations, no generic SaaS gradient blobs, no "powered by" badges. If a section feels like every other B2B site, it's wrong.
- **`data-hover`** on any interactive element so the custom cursor can grow.
- **Mobile-first responsive.** Every section must work on a phone. Test the floating glass card on a 375px viewport.

---

## Recent decision log

Newest first. Update when you make architectural moves.

### 2026-05-13 — Polish pass + typography lockdown + blog pause + state-health band

- **Two fonts only.** Dropped Instrument Serif (was a never-used fallback) and Caveat (`.handwritten` class never referenced). Site is now **Cormorant Garamond + Inter** loaded from a single Google Fonts URL in `globals.css`. `tailwind.config.ts` `fontFamily.mono` swapped from the bogus Inter alias to a real `ui-monospace` stack — `font-mono` is now actually monospace if anyone ever uses it.
- **Typography lockdown** (full audit in `2026-05-13` git history). H1 had 5+ different clamp formulas — collapsed to one: `clamp(40px,6.5vw,88px) leading-[0.98]`. H2 had 25 distinct clamps — collapsed to two (primary `clamp(28px,4.5vw,56px)`, secondary `clamp(24px,3.6vw,44px)`). Eyebrow tracking had 11 distinct values — collapsed to two (`0.22em` primary, `0.18em` secondary). Body text proliferation (text-[13/14/15/16/17/sm/base]) is **not yet cleaned up** — deferred because the surface area is huge and some hierarchy is intentional.
- **Map redesign.**
  - Markers rebuilt from flat circles to teardrop **SVG pin shapes** (logo in the round head, dark tail pointing to coordinate). Inline SVG, no asset dependency. Transform-origin moved to `50% 100%` so scale anchors the pin tip, not the centre.
  - Custom compact zoom controls in the bottom-right (Google's defaults are oversized for the card). Google's defaults disabled via `zoomControl: false`. The "Keyboard shortcuts" link disabled via `keyboardShortcuts: false`.
  - **Gesture handling switched to `cooperative`** + the cursor-centric wheel listener removed. Page now scrolls past the map normally. Zoom = +/- buttons, ctrl/cmd+wheel, or two-finger pinch. This is the locked-in behaviour — don't revert.
- **Home flow re-sequenced.** Final order: `HeroMap → LiveStatsStrip → LogosStrip → FounderVideo → AppShowcase → NotAnAgency → HowWereDifferent → LiveShiftFeed → DoctorVoicesPinned → FAQGrid → StateHealthBand → FinalCTA`.
- **State health band (new section).** Eight wordmark logos at the bottom of the home page (`NSW Health`, `Department of Health Victoria`, `Queensland Health`, `SA Health`, `Department of Health WA`, `Tasmanian Health Service`, `Northern Territory Government`, `ACT Government Health`). Each cell is an equalised bounding box (`h-28 md:h-32`, full grid-cell width) with `object-contain` so wide/tall/circular logos all read at the same visual weight. Files live in `public/partners/state-health/{slug}.png`. Eyebrow reads `SOME OF OUR CLIENTS` — neutral phrasing only, never "endorsed by" / "official partner" without written permission from each state.
- **About page redesign.** Hero portrait shrunk to a 440px-max-width right-anchored inset; pull-quote rebuilt as a two-column composition (quote left, `100%` hero numeric right, oversized italic `❝` watermark at 14% ocean behind); closing CTA replaced with a personal sign-off (italic Cormorant `Anu` signature, real `anu@statdoctor.net` mailto link, LinkedIn as a small secondary text link — no em-dash on the signature, no `Join as a doctor` button cluster).
- **Blog paused.** All 4 post JSONs deleted from `content/posts/`. `/blog` now renders an editorial **"soon."** placeholder (oversized italic Cormorant + headline + body + Back-to-home + Email-me-when-it's-live mailto). `/blog/[slug]` falls through to the global 404. Components in `components/blog/*` and `lib/blog/*` left untouched for when the pipeline comes back online — they're dead code for now.
- **Site-wide 404.** New `app/not-found.tsx` matches the `/blog` placeholder style — `LIVE PIL · 404` eyebrow + oversized italic Cormorant **`soon.`** + "This page is still in progress." + Back-to-home + Contact-support CTAs.
- **Image perf.** Converted `CitySlideshow` (17× 1.5-3MB city JPGs) and `AppShowcase` phone screens (4× 1-2.5MB PNGs) to `next/Image`. Now served as resized AVIF/WebP at the actual viewport size instead of raw originals — expected ~10× smaller payload on phones.
- **Deploy lesson learned.** Vercel watches `jasmineraj2005/statdoctor_frontend` (the `jasmine` remote, branch `jasmine-frontend`). Pushing to `origin/main` (`DrAnuG1995/website`) does NOT trigger a deploy. Always `git push jasmine main:jasmine-frontend` to ship.
- **Em-dash sweep.** Removed every `—` from user-visible copy (kept in code comments). The signature treatment on About uses just `Anu` (italic Cormorant), not `— Anu`.

### 2026-05-01 — Round 2.3 (founder video, real testimonials, real FAQs)
- **CEO/founder video** added between DNA and testimonials. Source: `StatDoctor Welcome Video.mov` (1080p HEVC, 85s, 100MB). Re-encoded with `ffmpeg -c:v libx264 -crf 27 -preset slow -vf "scale=-2:1080" -c:a aac -b:a 96k -movflags +faststart` → `public/founder-video.mp4` (21MB). Poster generated at `public/founder-video-poster.jpg`. Component `FounderVideo` in `app/HomeClient.tsx` autoplays muted on scroll via IntersectionObserver (threshold 0.4), pauses when out of view. Mute toggle bottom-right, founder credit chip bottom-left. Heading: "A note to my fellow locum doctors."
- **Testimonials → Lyra-style 3-column scroll** (matches `lyratechnologies.com.au`). Three vertical columns, alternating directions (up / down / up), continuous loop, hover any card to pause its column. 9 real testimonials pulled verbatim from `https://statdoctor.app/`. Faces are now small 40px circular avatars (no more zoomed-broken full-bleed crops).
- **FAQ → real questions, in-place popup**. 8 real FAQ items pulled from `statdoctor.app`. Each bubble has an `answerDir` (`up`/`down`/`left`/`right`) — the answer card pops out of the bubble in that fixed direction so siblings can never collide. When a bubble is active, every other bubble dims to 18% opacity and shrinks slightly. Hover OR click both work. Mobile fallback is a `<details>` accordion.
- **DNA whitespace tightened**. All step cards now anchor *above* the helix only (was alternating above/below). Removed the `mt-44 md:mt-52` defensive spacing on the timeline pills — it's now `mt-12 md:mt-14`. The Paid card still anchors right-edge so it can't spill off-screen.
- **Hospital name on map active label** bumped from `text-[11px]` to `text-[13px]/[14px]` so the partner name reads at a glance.

### 2026-05-01 — Round 2.2 (revert dive, polaroid voices, floating FAQ + center panel)
- **Map reverted to top-down loop**. The deep dive (zoom 16, pitch 65) was rendering Mapbox's flat building tiles as "boxes on the map" rather than recognisable hospitals. Back to zoom 9, pitch 0 — top-down city view. The 3D building extrusion layer was removed entirely. The loop now cycles through every hospital in `HOSPITALS` (not the curated 12-stop tour) at 3.5s per stop. Removed the bottom-right pip counter chip.
- **Voices → polaroid wall**. The stacked-card carousel is gone. Six small polaroid-style cards (3-col grid on desktop) with circular avatars (no more zoomed-broken faces — `object-cover scale-[1.6] object-[50%_22%]` keeps the face centered), short quotes, slight per-card rotation, hover-lift to straighten and front. Two of the six are fake testimonies for now (Marcus / Hannah).
- **FAQ → floating bubbles + central answer panel**. Floating drift animation is back. The overlap problem is solved by routing the active answer to a fixed centered ink panel below the bubble field — the bubble itself never expands in place, so neighbours can never collide. Hover or click any bubble to load it into the panel. Mobile fallback is a stacked `<details>` accordion.
- **DNA Paid card overflow fix**. Step 04 anchors to the right edge (using `right: max(0px, calc(...))`), Step 01 anchors to the left edge, middle steps stay centered. Progress pills below the helix bumped to `mt-44 md:mt-52` so the "below"-anchored cards (steps 02, 04) clear them with breathing room.
- **Footer marquee shrunk** from `display text-3xl/5xl` to `text-[10px] uppercase tracking-[0.28em]` — quiet accent line, no longer dominates the footer.
- **Partner logos bumped** from `h-8 md:h-10` to `h-12 md:h-16` — readable again.

### 2026-05-01 — Round 2.1 (deeper map dive + transparent logo)
- **Logo background stripped properly**: `scripts/strip-logo-bg.mjs` runs `sharp` color-to-alpha against the lavender app-store screenshot background. Output is a true transparent PNG at `public/statdoctor-logo.png`. Dropped the `mix-blend-multiply` CSS hack from the nav. `sharp` is installed `--no-save` (used once, not in `package.json`). To re-run: `npm install --no-save sharp && node scripts/strip-logo-bg.mjs` (the script restores the logo if you `cp` the original from the image cache first).
- **Map zoom pushed to 16, pitch 65°**: each tour stop now does a Google-Earth-style dive — from the AU overview down to the building block. Hold time bumped to 6.5s so the user can register the location; flyTo duration 5.5s with curve 1.7 for a slower, more cinematic descent.
- **3D building extrusions** added at `minzoom: 13` so when the camera arrives at a hospital, the buildings around it are visibly 3D. No extra cost — same Mapbox Vector Tiles SKU. Building heights interpolate from 0 → real-height as the camera passes zoom 13.

### 2026-05-01 — Round 2 polish (post-feedback)
- **Logo swap**: replaced the serif "StatDoctor" wordmark in the nav with the actual app logo at `public/statdoctor-logo.png` (blue stethoscope+plane). Uses `mix-blend-multiply` to drop the lavender PNG background into white.
- **Pill nav**: nav is now a centered floating capsule (Medlo-style) with rounded border, ocean-blue Sign-up button, animated width contraction on scroll. Old full-width strip is gone.
- **Map style**: switched from `mapbox/light-v11` to `mapbox/outdoors-v12` so the AU landmass shows greens and the ocean shows blue. Reads "real map" not "blank canvas". Same SKU, no cost change.
- **Type scale trimmed ~25%** site-wide. Hero floating card heading dropped from `clamp(28,3.6,46)` to `clamp(20,2.5,30)`. Section H2s dropped from `clamp(40,6.5,88)` to `clamp(28,4.2,56)` or smaller. Footer wordmark dropped from `clamp(56,11,180)` to `clamp(40,7.5,120)`. All cards have smaller padding and tighter type.
- **DNA → horizontal dot-particle helix**: rebuilt as a horizontal SVG strand made of ~440 individually-rendered particles (radial gradient fills in ocean and electric) that reveal sequentially with scroll. The pinned section is now 320vh, scroll-banded into 4 step regions — only the active step's card is visible at any time. Step nodes are clickable and scroll to their region.
- **Voices → proper Lyra-style**: removed the "scroll-to-step" pinned scroll mechanism (was causing the giant headline + redundant feel). Now an auto-advancing card stack inside a normal `py-32` section: 4 doctors, 5.5s rotation, manual prev/next arrows, active card sits in bone with ocean+electric top accent, name-tab triggers, ocean progress bar showing the auto-advance timer. Hovering the section pauses the rotation.
- **FAQ → ocean+electric grid**: replaced the floating-bubble layout (which overlapped) with a 3-column grid of 6 colour-rotated tiles (ocean / electric / leaf / ink). Each tile expands in-place with a non-overlapping `+` reveal, so the answer panel only ever grows inside its own grid cell. Active tile gets a 4px tonal ring.
- **Footer accents**: doctor CTA now hovers ocean (was bone). Wordmark sized down.

### 2026-05-01 — Brand palette extended
- Promoted `ocean: #3232ff` from "legacy" to a primary brand token (matches the app logo).
- Added `ocean-soft: #7b7bf4` for halos and tints.
- Added `leaf: #2f8f6e` for the FAQ tile colour rotation.

### 2026-05-01 — Homepage rebuilt from scratch on a white canvas
- Body background changed `#F5F1E8` → `#ffffff` in `globals.css`. Bone is now an accent only.
- **Removed** the agency-tax scroll-driven bar, the comparison table, the roadmap timeline, and the standalone App CTA. User flagged these for "later — start clean."
- **Replaced** the per-character `SplitText` hero headline with a Mapbox-powered hospital tour as the hero.
- **Replaced** the marquee testimonials with a Lyra-style scroll-pinned stacked-card reveal.
- **Replaced** the accordion FAQ with medlo-style floating question bubbles ("Still curious?") that hover-reveal answers.
- **Replaced** the "how it works" pinned phone with an interactive DNA double-helix that draws on scroll.
- **Slimmed the nav** to logo + Login + Sign-up. Sign-up opens a Faire-style "I'm a doctor / I'm a hospital" popover. Every other page link moved into the footer.
- **Footer redesigned** to a curenast-style editorial layout with a giant wordmark, dual CTAs, sitemap grid, and a marquee strip at the bottom.
- **Hero map**: Mapbox light-v11 base, all 44 partner hospitals as pins, 12-stop curated auto-tour with `flyTo()` + bone halo + electric pulse on the active pin. Click any pin to focus.

### 2026-05-01 — Mapbox installed
- Added `mapbox-gl@3.8.0` and `@types/mapbox-gl@3.4.1`.
- Public token in `.env.local` as `NEXT_PUBLIC_MAPBOX_TOKEN`.
- Free tier is the hard ceiling — see **Mapbox guardrails** above.
- All hospital coordinates hardcoded in `components/home/hospitals.ts` to avoid the Geocoding API. 44 partners pulled from `StatDoctor Hospitals - Sheet1 (2).csv`.

### Earlier — Initial redesign on `jasmine-frontend`
- Migrated from a static HTML build to Next.js 14 + Tailwind + Framer Motion.
- Established the brand palette, typography (Instrument Serif + Inter), and editorial direction.
- Built the agency-tax / how-it-works / roadmap / testimonials sections (subsequently rebuilt — see above).

---

## Things NOT to do

- **Don't** add a Google Maps API beyond the JS Maps + Places-already-set Map ID. No Geocoding, Directions, Static Images, Places, or Distance Matrix calls without explicit approval.
- **Don't** restore `gestureHandling: "greedy"` on the hero map or re-add a custom wheel listener with `e.preventDefault()`. The map must not capture page scroll.
- **Don't** restore Instrument Serif, Caveat, or any third font without explicit approval. The site is intentionally two fonts.
- **Don't** add a third eyebrow tracking value — snap to `0.22em` or `0.18em`. Same for headings — snap to the H1/H2 tokens above.
- **Don't** revert the body to bone. White is the canvas.
- **Don't** introduce a UI library (shadcn, Radix, MUI, etc.). The codebase is hand-built on purpose.
- **Don't** restore the agency-tax / comparison / roadmap sections without checking — they were intentionally removed.
- **Don't** edit hospital coordinates by hand in `components/home/hospitals.ts` unless you're updating the fallback list — the live pins come from Supabase.
- **Don't** push to `origin/main` and assume Vercel will deploy — it watches `jasmine/jasmine-frontend`. Always push to the `jasmine` remote.
- **Don't** restore blog posts or imply the journal is live — `/blog` is intentionally a Coming Soon page until the pipeline is rebuilt.
- **Don't** add state-coat-of-arms logos as "government endorsements". The `StateHealthBand` uses health-service wordmarks only, with neutral "Some of our clients" framing. Don't change that phrasing without written endorsement letters in hand.
- **Don't** use em-dashes (`—`) in user-visible copy. They were swept out on 2026-05-13. Use periods, commas, or restructure the sentence.
- **Don't** leave stale entries in this file. If you change something architectural, log it in the decision log above.

---

## How to run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
npx tsc --noEmit     # type-check
```

`.env.local` must contain:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...   # hero map; restricted by referrer in Cloud Console
NEXT_PUBLIC_SUPABASE_URL=...          # for hospital + shift data
NEXT_PUBLIC_SUPABASE_ANON_KEY=...     # public anon key, safe to ship to client
```

All three are also required on Vercel (Project Settings → Environment Variables) for the production build to render the map + live data.
