# StatDoctor — Marketing Site

The marketing site for [StatDoctor](https://statdoctor.app) — Australia's first locum doctor marketplace.

Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · Lenis · Google Maps · Supabase · OpenAI · Resend.

## Quickstart

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
npx tsc --noEmit     # type-check
npm test             # vitest unit + api
```

Create `.env.local` with:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...   # hero map (referrer-restricted in GCP)
NEXT_PUBLIC_SUPABASE_URL=...          # hospital + shift data
NEXT_PUBLIC_SUPABASE_ANON_KEY=...     # public anon key
OPENAI_API_KEY=...                    # /api/chat
RESEND_API_KEY=...                    # /api/lead
```

All five must also be set in Vercel → Project Settings → Environment Variables for production.

## Deploy

Production deploys from the **`jasmine-frontend`** branch on the **`jasmineraj2005/statdoctor_frontend`** fork (the `jasmine` git remote). Pushing to `origin/main` does **not** trigger a deploy.

```bash
git push jasmine main:jasmine-frontend
```

## Full documentation

See **[`project.md`](./project.md)** for the engineering bible: stack details, brand tokens, file layout, Google Maps guardrails, chat + lead capture wiring, conventions, decision log, and the design reference library.
