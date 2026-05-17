# StatDoctor — Marketing Site

A vendor-neutral guide to this codebase. Read top-to-bottom before making changes.

---

## 1. What this is

The marketing site for **StatDoctor** — Australia's first locum doctor marketplace. Two-sided: doctors and hospitals. The product itself is a mobile app; this site exists to drive doctor sign-ups and hospital onboarding.

- **Live domain**: `statdoctor.app` (apex canonical, `www` 308-redirects to apex).
- **Production deploy**: Vercel, watching the `jasmine-frontend` branch on `jasmineraj2005/statdoctor_frontend` (the `jasmine` remote). The upstream at `DrAnuG1995/website` (the `origin` remote) is **not** the deploy source — pushing to `origin/main` does not trigger a deploy.
- **To ship**: merge into local `main`, then `git push jasmine main:jasmine-frontend`.

**Strategic brief.** The category (locum doctor recruitment) is design-poor — every AU competitor (Medrecruit, Wavelength, Blugibbon, Hopmedic, Locumate, Go Locum) is either a 2010s WordPress recruiter site or a flat B2B SaaS page. **The brief is to ship a motion-driven editorial site that doesn't look like anything else in the category.** That's the moat.

---

## 2. Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | `app/` directory, RSC where possible, `"use client"` for motion sections |
| Language | TypeScript 5.5 strict | |
| Styling | Tailwind 3.4 | Brand tokens extended in `tailwind.config.ts` |
| Motion | Framer Motion 11 | Default for animation. GSAP is installed but rarely needed |
| Smooth scroll | Lenis 1.1 | Wired in `LenisProvider` in `app/layout.tsx` |
| Maps | Google Maps JS API via `@googlemaps/js-api-loader` v2 | Hero map only. AdvancedMarkerElement for pins. See §6 |
| Data | Supabase | Live hospitals + shifts (`lib/hospitals.ts`). Anon-key SSR fetch + realtime channel |
| Email | Resend | `/api/lead` sends chatbot lead captures to `anu@statdoctor.net` |
| AI | OpenAI (`openai` SDK) | `/api/chat` — site chatbot. Lead-capture funnel + persona detection |
| KV | `@vercel/kv` | Available but currently unused after the competitor-audit cron was removed |
| Deploy | Vercel | Watches `jasmine/jasmine-frontend` (see §1) |

**No state library, no CSS-in-JS runtime, no UI-library components.** If you need a primitive, build it.

---

## 3. Brand

### Palette — these four tokens, plus white

```
bone        #F5F1E8   Warm off-white / paper — accent surfaces, soft halos, active testimony card
ink         #1a1a2e   Primary text, dark surfaces, default border
electric    #cde35d   Lime accent — active states, highlights, the-one-thing-the-eye-lands-on
ocean       #3232ff   Brand blue (matches the StatDoctor app logo) — italic emphasis text, primary CTAs, FAQ tiles
ocean-soft  #7b7bf4   Lighter ocean for halos, tints, soft gradients
leaf        #2f8f6e   Muted medical green — FAQ tile rotation
muted       #6b7a73   Secondary text only — never as a fill or border
```

**The base background is white (`#ffffff`).** Bone is an accent, not a canvas. Use ocean and electric for emphasis; let white do the work.

Legacy tokens (`bone-2`, `gauze`, `parchment`, `ink-soft`, `electric-deep`, `light-blue`, `stat`) still exist in `tailwind.config.ts` and are referenced by older hospitals/partners/contact pages that haven't been fully redesigned. **Don't use legacy tokens in new code.**

### Typography — two fonts only

- **Display**: Cormorant Garamond (italics for emphasis). Loaded via Google Fonts in `app/globals.css`, exposed as the `display` font-family and `.display` class.
- **Body / UI**: Inter. Also used by the legacy `.mono` class.

Type tokens (lock these in for new sections):

- **H1 page hero**: `text-[clamp(40px,6.5vw,88px)] leading-[0.98]`
- **H2 primary section**: `text-[clamp(28px,4.5vw,56px)] leading-[1.0]`
- **H2 secondary section**: `text-[clamp(24px,3.6vw,44px)] leading-[1.05]`
- **Eyebrow primary**: `text-[10px] tracking-[0.22em] uppercase text-muted`
- **Eyebrow secondary**: `text-[11px] tracking-[0.18em] uppercase`

Outside `VideoSlot` (a dev scaffold), there should only be two eyebrow tracking values (`0.22em` / `0.18em`).

### Design direction

Motion-rich, editorial, scroll-driven. Every section earns its place with motion. References: Apple iPhone scroll-pinned chapters, Lyra Technologies sticky testimony reveal, Faire's two-sided onboarding. **Don't reference locum competitors as positive examples** — they are the cautionary baseline. The full reference library lives in §11.

---

## 4. File layout

```
app/
  layout.tsx            Root: Lenis + Nav + Footer + ChatWidget + global metadata (metadataBase = statdoctor.app)
  page.tsx              Home shell — SSR fetches hospitals/shifts from Supabase, renders <HomeClient />
  HomeClient.tsx        Homepage sections (client component).
                        Order: HeroMap → LiveStatsStrip → LogosStrip → FounderVideo → AppShowcase
                          → NotAnAgency → HowWereDifferent → LiveShiftFeed → DoctorVoicesPinned
                          → FAQGrid → StateHealthBand → FinalCTA
  not-found.tsx         Site-wide 404 — editorial "soon." treatment
  globals.css           Body bg, typography classes, Lenis CSS, marquee mask
  robots.ts             SEO — imports SITE_URL from lib/site.ts
  sitemap.ts            SEO — imports SITE_URL from lib/site.ts; includes static routes + blog posts
  api/
    chat/route.ts       OpenAI-backed chatbot (POST). System prompt in lib/chat/prompt.ts.
                        Rate-limited via lib/rateLimit.ts. Returns Server-Sent Events.
    lead/route.ts       Resend-backed lead capture (POST). Sends chat-transcript-as-HTML to LEAD_EMAIL_TO.
  about/                Founder essay (Hero + 3-chapter Story + TravelAgentParallel + PullQuote + team cards + Closing)
  hospitals/            Hospitals landing — full redesign (city-slideshow hero, pricing, demo, FAQ)
  for-doctors/          Doctor funnel — full redesign
  partners/             Doctor perks (CPD Home + Validex + etc.) — full redesign
  contact/              Contact form — legacy, pending redesign
  blog/                 Editorial blog. 27 curated locum posts imported from Webflow with hero images.
                        Read by lib/blog/posts-server.ts at request time.
                        /blog/[slug] sets canonical via alternates.canonical (imports SITE_URL).
  privacy-policy/       Legal
  terms-of-use/         Legal

components/
  Nav.tsx               Slim: logo + Doctors/Hospitals/Partners links + Login + Download App.
                        Links hospital.statdoctor.app (a separate subdomain / Vercel project).
  Footer.tsx            Editorial footer — every page link lives here now
  LenisProvider.tsx     Smooth scroll wrapper
  Cursor.tsx            Custom cursor (data-hover targets)
  CitySlideshow.tsx     Ken-Burns crossfade slideshow — background of /hospitals + /for-doctors hero
  DownloadModal.tsx     iOS / Play Store modal triggered by Nav "Download App"
  MagneticButton.tsx    Legacy
  SplitText.tsx         Per-character reveal — used on blog placeholder + legacy
  Counter.tsx           Animated counter — LiveStats only
  VideoSlot.tsx         Legacy dev scaffold (contains the only outlier tracking values)
  LegalPage.tsx         Shared layout for /privacy-policy + /terms-of-use
  blog/                 Post chrome (PostDetail, RelatedArticles, JoinCta, DisclaimerBanner, etc.)
  chat/                 ChatWidget + useChat hook (talks to /api/chat, captures leads via /api/lead)
  home/
    HeroMap.tsx         Google Maps AU hero. Teardrop SVG pins (logo in head). Elastic AU bounds.
                        Cooperative gesture handling — map does NOT capture page scroll.
    hospitals.ts        Fallback hospital coordinates (used only if Supabase is empty)
    LiveStats.tsx       Aggregate metrics tile row
    LiveShiftFeed.tsx   Real shifts from Supabase + realtime channel
    AppShowcase.tsx     4-step phone-screens reveal driven by scroll progress
    HowWereDifferent.tsx Agency-vs-StatDoctor flow diagram
    NotAnAgency.tsx     "We are not an agency" beat

lib/
  site.ts               Single source of truth: SITE_URL = "https://statdoctor.app"
  hospitals.ts          Supabase fetches (hospitals, shift counts, live shifts, live stats) + key helpers
  partner-logos.ts      Curated partner-logos marquee
  hero-slides.ts        CitySlideshow source list
  marketing-stats.ts    Curated marketing numbers (VERIFIED_DOCTORS, AGENCY_FEES_SAVED_AUD, …)
  rateLimit.ts          In-memory rate limit for /api/chat + /api/lead
  chat/
    prompt.ts           System prompt + persona/funnel logic for the chatbot
    extractCta.ts       Parses [BOOK_DEMO] / [DOWNLOAD_APP] tokens out of model output to render buttons
  blog/
    posts.ts            Client-safe types + helpers
    posts-server.ts     `import "server-only"` — reads content/posts/*.json
    media.ts            `import "server-only"` — image hydration + caching

content/posts/          Blog post JSON (27 curated locum articles). Output of the sibling
                        STATDOCTOR_BLOGPOSTING Python pipeline. Read at build/request time.

public/
  doctors/              Doctor headshots
  hospitals/            City photos for the CitySlideshow hero (17 cities, served via next/Image)
  screens/              Phone-screenshot PNGs for AppShowcase
  partners/state-health/ 8 state/territory health-service wordmarks
  founder-video.mp4     Anu's welcome video (21MB H.264, re-encoded from 100MB HEVC source)

tests/                  Vitest. unit/ + api/ + e2e/ (e2e opt-in via npm run test:e2e)
scripts/                One-off CLI scripts (Playwright screenshots, hospital geocoding audits,
                        logo bg stripping, etc.). Not part of the build. node scripts/<name>.mjs.
```

**Convention:** route-specific components live in `components/<route>/`. Shared primitives live at `components/` root.

---

## 5. Environment + deploy

### Local

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
npx tsc --noEmit     # type check
npm test             # vitest unit + api tests
npm run test:e2e     # opt-in Playwright + real OpenAI; needs dev server up
```

### `.env.local` must contain

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...   # hero map; referrer-restricted in Cloud Console
NEXT_PUBLIC_SUPABASE_URL=...          # hospital + shift data
NEXT_PUBLIC_SUPABASE_ANON_KEY=...     # public anon key — safe to ship to client
OPENAI_API_KEY=...                    # /api/chat
RESEND_API_KEY=...                    # /api/lead — see Resend domain note below
LEAD_EMAIL_TO=anu@statdoctor.net      # optional (default)
LEAD_EMAIL_FROM=...                   # optional — only after statdoctor.app is verified in Resend
```

All five secrets must also be set in Vercel → Project Settings → Environment Variables for production.

### Domain cutover (in progress)

- DNS at GoDaddy. Apex `A @ 216.198.79.1` (Vercel's new apex IP). Old `A @ 198.202.211.1` (legacy host) is being removed during cutover.
- `www` CNAME points at Vercel's per-domain CNAME target; `www.statdoctor.app` 308-redirects to the apex.
- **Resend domain not yet verified.** `LEAD_FROM` falls back to `StatDoctor Bot <onboarding@resend.dev>`. Once statdoctor.app is verified in Resend (3 DNS records), set `LEAD_EMAIL_FROM=StatDoctor Bot <bot@statdoctor.app>` in Vercel and redeploy.
- **Hospital portal** (`hospital.statdoctor.app`) is a separate Vercel project. The DNS CNAME for `hospital` is unrelated — don't touch it.

---

## 6. Google Maps guardrails

The site moved off Mapbox onto Google Maps because the brief wanted real logo-pin markers (AdvancedMarkerElement) and the Supabase-driven hospital list grew beyond the original curated tour. The map is the **single most billable surface** on the site.

1. **One map per page load.** Only the homepage hero has a map. Reuse the existing instance via refs if you need to drive it from elsewhere.
2. **Map ID is `DEMO_MAP_ID`** (Google's free demo Map ID — enables vector rendering + AdvancedMarkerElement). Swap to a production-owned Map ID via Cloud Console → Map Management when ops sets one up. Styling can ONLY be configured via the Map ID — inline `styles` arrays are ignored.
3. **No Geocoding, Directions, Places, Static Images, or Distance Matrix calls.** Coordinates come from Supabase. Marketing only needs the rendered map.
4. **AdvancedMarkerElement only.** Pins are teardrop SVGs built in `buildMarkerElement()` in `HeroMap.tsx`. Logo loads from the hospital's `logo_url`. Don't fall back to deprecated `google.maps.Marker`.
5. **`gestureHandling: "cooperative"`.** The map must NOT capture page-scroll wheel events. Users zoom via corner +/- buttons, ctrl/cmd+wheel, or pinch. Don't restore `"greedy"` or re-add a `wheel` listener with `preventDefault()`.
6. **`restriction: { latLngBounds: AU_BOUNDS, strictBounds: false }`** — elastic bounds. Don't flip to `strictBounds: true` (it crops the overview view).
7. **Referrer allowlist matters.** Production domain + `localhost:3000` are in the Cloud Console allowlist. If you start the dev server on a different port, the map fails with `RefererNotAllowedMapError` until you add it.

---

## 7. Chat + lead capture

The site chatbot lives in `components/chat/` and is wired in via `<ChatWidget />` in `app/layout.tsx`.

- `useChat` hook holds the conversation, streams responses from `/api/chat` (SSE), and posts captured leads to `/api/lead` when the funnel completes.
- System prompt in `lib/chat/prompt.ts`. Detects persona (doctor vs hospital) and steers the funnel — for hospitals, the bot is allowed to emit a `[BOOK_DEMO]` token which is parsed out by `extractCta.ts` and rendered as a HubSpot demo-calendar button.
- `/api/chat` is rate-limited (in-memory map in `lib/rateLimit.ts`).
- `/api/lead` requires `RESEND_API_KEY`. Returns 503 without it. Validates persona + email + name shape, slices conversation to last 20 messages, sends HTML transcript to `LEAD_EMAIL_TO`.
- 7 regression tests guard the lead route + 17 guard the chat route. **Don't remove the rate-limit isolation in `vitest.config.ts`** — module-level state would bleed between test files.

---

## 8. Conventions

- **No new dependencies without a reason.** The user explicitly wants a tight stack.
- **No comments unless the WHY is non-obvious.** Identifiers do the documenting. Don't write `// fetch the data` above a `fetch`.
- **No backwards-compatibility shims.** If a section is removed, delete it — don't `_deprecated` it.
- **Match the editorial bar.** No stock illustrations, no generic SaaS gradient blobs, no "powered by" badges. If it feels like every other B2B site, it's wrong.
- **`data-hover`** on any interactive element so the custom cursor can respond.
- **Mobile-first responsive.** Every section must work on a 375px phone.
- **TDD where it earns its keep.** New API routes get vitest mocks for their external SDKs (`vi.hoisted` to share the mock across the route's module load). The 76-test baseline must stay green.

---

## 9. Things NOT to do

- **Don't** add a Google Maps API beyond JS Maps + Map ID. No Geocoding, Directions, Static Images, Places, or Distance Matrix without explicit approval.
- **Don't** restore `gestureHandling: "greedy"` on the hero map or re-add a wheel listener with `preventDefault()`.
- **Don't** restore Instrument Serif, Caveat, or any third font. The site is intentionally two fonts.
- **Don't** add a third eyebrow tracking value — snap to `0.22em` or `0.18em`. Same for headings — snap to the H1/H2 tokens in §3.
- **Don't** revert the body to bone. White is the canvas.
- **Don't** introduce a UI library (shadcn, Radix, MUI, etc.). The codebase is hand-built on purpose.
- **Don't** restore the agency-tax / comparison / roadmap sections without checking — they were intentionally removed.
- **Don't** edit hospital coordinates by hand in `components/home/hospitals.ts` unless updating the fallback list — live pins come from Supabase.
- **Don't** push to `origin/main` and assume Vercel will deploy — it watches `jasmine/jasmine-frontend`. Always push to the `jasmine` remote.
- **Don't** add state-coat-of-arms logos as "government endorsements." The `StateHealthBand` uses health-service wordmarks only, with neutral "Some of our clients" framing. Don't change the phrasing without written endorsement letters in hand.
- **Don't** use em-dashes (`—`) in user-visible copy. Use periods, commas, or restructure.
- **Don't** add a Vercel cron schedule more frequent than once-per-day if the project is on Hobby — Hobby silently caps to one daily run and may block PRs that include cron entries. The previous 15-min cron was dropped for this reason.
- **Don't** introduce a `metadataBase` value other than `SITE_URL` from `lib/site.ts`. OG/Twitter image URLs must resolve against the canonical apex.

---

## 10. Decision log

Newest first. Update when you make architectural moves.

### 2026-05-17 — Domain cutover + SITE_URL centralization
- DNS migration from old host to Vercel. Apex on `216.198.79.1` (Vercel's new apex IP, replacing legacy `76.76.21.21`). `www` CNAME points at Vercel; both verified in Vercel project Domains. Canonical direction flipped to apex-primary so it matches the code.
- Centralized `SITE_URL` in `lib/site.ts`. `robots.ts`, `sitemap.ts`, `blog/[slug]/page.tsx` all import from it now.
- Added `metadataBase: new URL(SITE_URL)` to `app/layout.tsx` — fixes a latent bug where relative OG/Twitter image URLs would have resolved to `localhost:3000` in production builds.
- 4 TDD tests in `tests/unit/site-url.test.ts` guard the canonical origin, the robots sitemap entry, and the metadataBase value.

### 2026-05-14 — Blog back online
- Imported 27 curated locum-doctor posts from Webflow with topical hero images into `content/posts/`.
- Blog renders again at `/blog` and `/blog/[slug]`. Components in `components/blog/*` and `lib/blog/*` reactivated.
- `/blog/[slug]` sets `alternates.canonical` to the apex URL.

### 2026-05-13 — Chat fixes + cron drop
- Fixed three real-conversation failure modes in `/api/chat`; added 7 regression tests.
- Dropped the 15-min serverless warmup cron from `vercel.json` — Vercel Hobby was blocking pushes that contained sub-daily cron schedules. The `vercel.json` `crons` array is now empty.
- `/api/chat`'s GET handler (the no-op JIT path) is still in place; it just isn't pinged automatically.

### 2026-05-13 — About page polish
- Team-cards section redesigned: circle portraits, 2-column grid, full bios. Renamed Seif Othman → Seif Ouselati.

### 2026-05-13 — Typography lockdown, two-fonts-only, state health band, map redesign, blog pause
- **Two fonts only.** Dropped Instrument Serif (never used) and Caveat (`.handwritten` class never referenced). Site is Cormorant Garamond + Inter.
- **Typography audit.** H1 had 5+ clamp formulas — collapsed to one. H2 had 25 distinct clamps — collapsed to two. Eyebrow tracking had 11 values — collapsed to two.
- **Map redesign.** Flat circles → teardrop SVG pins (logo in the round head, dark tail at the coordinate). Transform-origin moved to `50% 100%` so scale anchors the pin tip. Custom compact +/- zoom controls.
- **Cooperative gesture handling locked in.** Page scrolls past the map normally. Zoom is +/- buttons, ctrl/cmd+wheel, or pinch.
- **State health band.** Eight wordmark logos at the bottom of home (`NSW Health`, `Department of Health Victoria`, `Queensland Health`, `SA Health`, `Department of Health WA`, `Tasmanian Health Service`, `Northern Territory Government`, `ACT Government Health`). Eyebrow reads `SOME OF OUR CLIENTS` — neutral phrasing only.
- **About page redesign.** Hero portrait shrunk to a 440px right-anchored inset; pull-quote rebuilt as two-column. Closing replaced with a personal sign-off (italic Cormorant `Anu`, real mailto, LinkedIn secondary).
- **Image perf.** CitySlideshow (17 city JPGs) and AppShowcase phone screens converted to `next/Image` — now served as resized AVIF/WebP.
- **Em-dash sweep.** Removed every `—` from user-visible copy.

### 2026-05-01 — Round 2.3
- Founder video added between DNA and testimonials (HEVC re-encoded to MP4, autoplays muted on intersection).
- Testimonials → Lyra-style 3-column scroll (alternating directions, hover pauses column). 9 real testimonials.
- FAQ → real questions in in-place popup. 8 items pulled from statdoctor.app, `answerDir` per bubble so siblings can't collide.
- DNA whitespace tightened; map active label bumped to readable size.

### 2026-05-01 — Round 2.2
- Map reverted to top-down loop (zoom 9, pitch 0). The deep dive at pitch 65 was rendering Mapbox flat building tiles as unrecognisable boxes.
- Voices → polaroid wall. Faces fixed (`object-cover scale-[1.6] object-[50%_22%]`).
- FAQ → floating bubbles + centered ink answer panel. Overlap solved.

### 2026-05-01 — Round 2.1
- Logo background stripped via `scripts/strip-logo-bg.mjs` (sharp color-to-alpha). True transparent PNG at `public/statdoctor-logo.png`. Dropped the `mix-blend-multiply` hack.
- Map zoom pushed to 16, pitch 65° — Google-Earth-style dive per tour stop (later reverted in Round 2.2).
- 3D building extrusions added (later reverted).

### 2026-05-01 — Round 2 polish
- Logo swap (serif wordmark → real app logo).
- Pill nav (centered floating capsule, Medlo-style).
- Mapbox style: `light-v11` → `outdoors-v12`.
- Type scale trimmed ~25% site-wide.
- DNA → horizontal dot-particle helix.
- FAQ → ocean+electric grid (later iterated again).

### 2026-05-01 — Brand palette extended
- Promoted `ocean: #3232ff` to a primary token.
- Added `ocean-soft: #7b7bf4` and `leaf: #2f8f6e`.

### 2026-05-01 — Homepage rebuilt on a white canvas
- Body bg `#F5F1E8` → `#ffffff`. Bone became accent only.
- Removed: agency-tax scroll bar, comparison table, roadmap timeline, standalone App CTA.
- Replaced: hero headline → Mapbox hospital tour. Marquee testimonials → scroll-pinned cards. Accordion FAQ → floating bubbles. Pinned phone → DNA helix.

### Earlier
- Migrated from a static HTML build to Next.js 14 + Tailwind + Framer Motion.
- Established brand palette, typography, editorial direction.

---

## 11. Reference library

Curated inspirations, organised by purpose. Not exhaustive — see source links for full study.

### Healthtech you should learn from
- [Heidi Health](https://www.heidihealth.com/en-au) — specialty-segmented pages, compliance badges in nav
- [Lyra Technologies](https://lyratechnologies.com.au/) — scroll-driven proof density. The reference for scroll-storytelling
- [Everlab](https://www.everlab.com.au/) — rotating biomarker marquee, 100+ doctor gallery
- [Nutromics](https://www.nutromics.com/) — cinematic biotech motion
- [Diag-Nose](https://www.diag-nose.io/) — editorial medtech feel
- [OpenEvidence](https://www.openevidence.com), [Tempus](https://www.tempus.com), [Neuralink](https://neuralink.com)

### SaaS / B2B gold standard
- [Linear](https://linear.app), [Stripe](https://stripe.com), [Vercel](https://vercel.com), [Attio](https://attio.com), [Cal.com](https://cal.com), [Plain](https://plain.com), [Resend](https://resend.com), [Clerk](https://clerk.com), [Supabase](https://supabase.com)

### Marketplace / two-sided (most relevant to StatDoctor)
- [Faire](https://www.faire.com) — explicit dual onboarding ("Sign up to buy" / "Sign up to sell"). **Closest analogue to StatDoctor**
- [Airbnb](https://www.airbnb.com) — canonical two-sided trust pattern
- [DoorDash](https://www.doordash.com) — three-audience IA without splintering brand
- [Turo](https://turo.com), [Upwork](https://www.upwork.com)

### Editorial / motion-driven
- [Apple — iPhone](https://www.apple.com/iphone) — scroll-pinned chapter nav. The reference for sequenced narrative
- [Lando](https://lando.com), [Scout Motors](https://scoutmotors.com), [Igloo Inc](https://igloo.inc), [Basement Studio](https://basement.studio), [Oxide Computer](https://oxide.computer)

### Locum competitors (the cautionary baseline — design-poor category)
| Company | Site | Type |
|---|---|---|
| Hopmedic | https://hopmedic.com/ | Marketplace + telehealth (closest model) |
| Go Locum | https://golocum.com.au/ | Web app, remote-AU focus |
| Wavelength International | https://wave.com.au/ | Largest AU medical recruiter (agency) |
| Medrecruit | https://medrecruit.medworld.com/ | Australasia's largest recruiter (agency) |
| Blugibbon | https://www.blugibbon.com.au/ | Sydney-based agency |
| Locumate | https://locumate.ai/ | Multi-vertical staffing marketplace |
| Patchwork Health | https://patchwork.health/ | UK — strongest brand voice in the category |
| Nomad Health | https://nomadhealth.com/ | US — closest US analogue |

### Adjacent (where the craft lives)
- Healthcare-adjacent design-led: [Maven Clinic](https://www.mavenclinic.com), [Hims](https://www.hims.com), [Ro](https://ro.co), [Function Health](https://www.functionhealth.com), [Parsley Health](https://www.parsleyhealth.com)
- Motion + typography craft: Linear, Stripe, Vercel, Arc, Cursor, Raycast (above)

### Reference-finding tools (for when the list goes stale)
- [Awwwards — Sites of the Day](https://www.awwwards.com/websites/sites_of_the_day/), [Land-book](https://land-book.com/), [Lapa Ninja](https://www.lapa.ninja/), [Godly](https://godly.website/), [Httpster](https://httpster.net/), [Mobbin](https://mobbin.com/browse/web/apps), [Framer Templates](https://www.framer.com/templates/), [Build UI](https://buildui.com/), [Motion Primitives](https://motion-primitives.com/), [Rauno](https://rauno.me/)
