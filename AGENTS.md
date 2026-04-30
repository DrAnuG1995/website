# AGENTS.md — StatDoctor Marketing Site

A vendor-neutral guide for AI coding agents (Claude, GPT, Cursor, etc.) working in this repo. Read top-to-bottom before making changes.

---

## What this is

The marketing site for **StatDoctor** — Australia's first locum doctor marketplace. Two-sided: doctors and hospitals. The product is a mobile app; this site exists to drive doctor sign-ups and hospital onboarding.

Live at `statdoctor.app`. The current redesign happens on the **`jasmine-frontend`** branch.

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
| Maps | Mapbox GL JS 3.8 | See **Mapbox guardrails** section below |
| Deploy | Vercel | Production = `main` branch |

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

Legacy tokens still exist in `tailwind.config.ts` (`bone-2`, `gauze`, `parchment`, `ink-soft`, `electric-deep`, `light-blue`, `stat`) — these are **referenced by the older hospitals/partners/blog/contact pages** which haven't been redesigned yet. **Do not use legacy tokens in new code.** Cleanup will happen page-by-page.

Typography:
- Display: **Instrument Serif** (italics used for emphasis lines)
- Body / UI: **Inter** (also used for the legacy `.mono` class)

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
  page.tsx              SSR shell that renders <HomeClient />
  HomeClient.tsx        Homepage sections (client component)
  globals.css           Body bg, typography classes, Lenis CSS, marquee mask
  hospitals/            Legacy page — pending redesign
  partners/             Legacy page — pending redesign
  blog/                 Legacy page — pending redesign
  contact/              Legacy page — pending redesign
  privacy-policy/       Legal — kept as-is
  terms-of-use/         Legal — kept as-is
components/
  Nav.tsx               Slim: logo + Login + Sign-up popover
  Footer.tsx            Editorial footer — every page link lives here now
  LenisProvider.tsx     Smooth scroll wrapper
  Cursor.tsx            Custom cursor (data-hover targets)
  MagneticButton.tsx    Magnetic hover button (legacy pages still use it)
  SplitText.tsx         Per-character reveal — legacy
  Counter.tsx           Animated counter — legacy
  VideoSlot.tsx         Video frame — legacy
  LegalPage.tsx         Shared legal layout
  home/
    HeroMap.tsx         Mapbox AU hero with auto-cycling pin tour
    hospitals.ts        Hardcoded hospital coordinates + tour subset
public/
  doctors/              Doctor headshots
reference.md            Design inspirations + competitor URLs
StatDoctor Hospitals - Sheet1 (2).csv   Source CSV for partner hospitals
```

Convention: components specific to one route live in `components/<route>/`. Shared primitives live at `components/` root.

---

## Mapbox guardrails (free-tier discipline)

Mapbox GL JS web tier: **50,000 monthly map loads free**. Beyond that, $5 per 1,000 loads. **The user does not want any billing.** Treat the free tier as a hard ceiling.

Rules in this repo:

1. **One `new mapboxgl.Map()` per page load.** The hero is the only map on the site. Re-using the existing instance via refs is mandatory — never create a second map for any feature.
2. **No Geocoding API.** Hospital coordinates are hardcoded in `components/home/hospitals.ts`. If you need a new location, add the lat/lng manually — do **not** add a `mapbox-sdk` dependency or call the geocoding endpoint.
3. **No Static Images, Directions, Tilequery, or Isochrone APIs.** None of these are in use. Don't introduce them.
4. **IntersectionObserver pause.** The hero auto-tour halts when the section scrolls off-screen. Preserve this behaviour. Reason: prevents tile fetches on background tabs.
5. **`collectResourceTiming: false`** is set on the map constructor to disable Mapbox's telemetry beacon. Keep it that way.
6. **Cached tiles only.** The auto-tour cycles through 12 hospitals within Australia. After the first cycle, every visible tile is cached — subsequent cycles fetch nothing new. Don't add zoom-out / fly-to-Antarctica / tilt-to-90° camera moves that pull fresh tiles unnecessarily.
7. **Token is in `.env.local`** as `NEXT_PUBLIC_MAPBOX_TOKEN`. This is a public token (`pk.*`) and is safe to ship to the client — but rotate via the Mapbox dashboard if it ever leaks.

If the free tier is ever exhausted: it resets monthly. Don't switch to a different paid provider — disable the map (the hero already has a fallback `Map disabled` state) and wait.

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

- **Don't** add a paid Mapbox feature, geocoding call, or analytics SDK without explicit approval.
- **Don't** revert the body to bone. White is the canvas now.
- **Don't** introduce a UI library (shadcn, Radix, MUI, etc.). The codebase is hand-built on purpose.
- **Don't** restore the agency-tax / comparison / roadmap sections without checking — they were intentionally removed.
- **Don't** put navigation links back in the top bar. Nav is logo + Login + Sign-up only.
- **Don't** edit hospital coordinates without verifying the lat/lng. A wrong pin in the hero is more visible than anywhere else on the site.
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

`.env.local` must contain `NEXT_PUBLIC_MAPBOX_TOKEN` for the hero map to render.
