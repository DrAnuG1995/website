# StatDoctor — Marketing Site

Next.js 14 marketing site for StatDoctor, the locum shift platform connecting Australian doctors with hospitals and clinics.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for styling, with custom brand tokens in `tailwind.config.ts`
- **Framer Motion** for component animation, **GSAP** for hero-level choreography
- **Lenis** for smooth scroll
- **Mapbox GL** for the interactive globe in the home hero
- **OpenAI + Vercel KV** for the admin competitor-topics tooling

## Running locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint         # next lint
```

## Project layout

```
app/
  page.tsx              # / — home (renders HomeClient.tsx)
  for-doctors/          # /for-doctors — doctor funnel
  hospitals/            # /hospitals — hospital dashboard pitch + pricing
  partners/             # /partners — doctor perks (Hnry, CPD Home, etc.)
  about/  contact/  blog/
  privacy-policy/  terms-of-use/
  admin/                # internal tooling
  api/                  # route handlers
  layout.tsx            # root layout (Nav + global providers + Footer)
  globals.css           # Tailwind layer + global resets
components/
  Nav.tsx               # top nav (Doctors | Hospitals | Partners pill + CTAs)
  Footer.tsx
  DownloadModal.tsx     # iOS/Android app download sheet
  home/                 # home-page sections (HeroMap, FeatureShowcase, etc.)
  blog/                 # blog post chrome (TOC, sidebar, share)
```

## Deployment

Auto-deploys to Vercel on push:
- `main` → production
- feature branches → preview URL (per-branch)

Current dev branch: `jasmine-frontend`.

## Branding

Primary palette is defined in `tailwind.config.ts` — `ocean` (#3232ff), `electric` (lime), `leaf`, `ink`, `bone`, `lavender`. Display font is Cormorant via the `.display` utility; body uses the default sans stack.
