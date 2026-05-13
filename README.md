# StatDoctor — Marketing Site

Next.js 14 marketing site for StatDoctor, the locum shift platform connecting Australian doctors with hospitals and clinics.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for styling, with custom brand tokens in `tailwind.config.ts`
- **Framer Motion** for component animation, **GSAP** for hero-level choreography
- **Lenis** for smooth scroll
- **Mapbox GL** for the interactive globe in the home hero

## Running locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint         # next lint
```

## Project layout

This is a Next.js 14 App Router project, so frontend (pages, components, client interactivity) and backend (route handlers, server-only data access, cron jobs) co-exist inside `app/` by design. The lists below label every top-level directory and file by role.

### Frontend — pages, layouts, client components

```
app/                    # App Router routes. Each folder = a URL segment.
  layout.tsx              # Root layout: Nav + Lenis smooth scroll + Footer
  page.tsx                # / — home shell (renders HomeClient.tsx)
  HomeClient.tsx          # "use client" home page interactivity
  globals.css             # Tailwind layers + global resets
  robots.ts  sitemap.ts   # Static SEO endpoints (build-time)
  about/  contact/        # Static marketing pages
  for-doctors/            # /for-doctors — doctor funnel + partner network
  hospitals/              # /hospitals — pitch + pricing
  partners/               # /partners — doctor perks (Hnry, CPD Home, etc.)
  blog/                   # /blog index + /blog/[slug] post pages
  privacy-policy/  terms-of-use/

components/             # Reusable React components (all frontend).
  Nav.tsx                 # Top nav (Doctors | Hospitals | Partners pill + CTAs)
  Footer.tsx
  DownloadModal.tsx       # iOS/Android app download sheet
  LenisProvider.tsx       # Smooth-scroll provider wrapping <body>
  MagneticButton.tsx  SplitText.tsx  Counter.tsx  VideoSlot.tsx
  LegalPage.tsx           # Shared layout for /privacy-policy + /terms-of-use
  home/                   # Home-page sections (HeroMap, FeatureShowcase, …)
  blog/                   # Blog post chrome (TOC, sidebar, share, gallery)

public/                 # Static assets served at /
  doctors/  partners/  screens/   # Imagery
  founder-video.mp4  founder-video-poster.jpg
  statdoctor-logo.png  sd-pin.png  author-anu.png
```

### Backend — server-only data

```
lib/blog/
  posts-server.ts         # `import "server-only"` — reads content/posts/*.json
  media.ts                # `import "server-only"` — image hydration + caching
```

### Shared — types + client-safe helpers

```
lib/blog/
  posts.ts                # Post type definitions + client-safe helpers.
                          # Imported by both server (posts-server) and client
                          # (BlogClient, PostDetail, RelatedArticles).
```

### Data

```
content/posts/          # Blog post JSON files (output of the Python pipeline
                        # in the sibling STATDOCTOR_BLOGPOSTING repo). Read at
                        # build/request time by lib/blog/posts-server.ts.
```

### Tooling — node scripts (not shipped)

```
scripts/                # One-off CLI scripts run via `node scripts/<name>.mjs`
  audit-hospital-pins.mjs  check-pins-strict.mjs  apply-pin-fixes.mjs
  regeocode-hospitals.mjs  revert-bulk-geocode.mjs
  screenshot.mjs  screenshot-pins.mjs  screenshot-sections.mjs
  playwright-smoke.mjs  responsive-audit.mjs  ux-audit.mjs
  beat-check.mjs  scroll-check.mjs  mascot-check.mjs  debug-reckoning.mjs
  logo-audit.mjs  logo-index.mjs  strip-logo-bg.mjs
```

### Config + docs (repo root)

```
next.config.mjs  tsconfig.json  tailwind.config.ts  postcss.config.mjs
package.json  package-lock.json  vercel.json  next-env.d.ts
.env  .env.local         # Local secrets (gitignored)

AGENTS.md               # Engineering bible — AI assistant entry point
reference.md            # Design inspirations + competitor URLs
README.md               # This file
```

## Deployment

Auto-deploys to Vercel on push:
- `main` → production
- feature branches → preview URL (per-branch)

Current dev branch: `jasmine-frontend`.

## Branding

Primary palette is defined in `tailwind.config.ts` — `ocean` (#3232ff), `electric` (lime), `leaf`, `ink`, `bone`, `lavender`. Display font is Cormorant via the `.display` utility; body uses the default sans stack.
