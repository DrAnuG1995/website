# Serverless warmup

## What's wired up

- `GET /api/chat` returns `{ ok: true }` — a no-op handler that references the
  heavy imports (OpenAI SDK, system prompt builder) so they JIT into the warm
  lambda. Defined in `app/api/chat/route.ts`.
- `vercel.json` declares a cron at `*/15 * * * *` pointing at `/api/chat`. Every
  15 min is below Vercel's typical idle-evict window, so the chat function
  should stay warm between user sessions.

## Why warm `/api/chat` and not `/api/lead`

- `/api/chat` is the only route where cold-start latency stacks on top of an
  already-slow operation (OpenAI streaming). Trimming 300-500 ms off the first
  message of the day is the user-visible win.
- `/api/lead` is one-shot and rare. A cold start there is hidden inside the
  form-submit spinner and not worth a separate ping.
- In Vercel's serverless model, each route is usually its own lambda — pinging
  one route does not warm the others. So we ping the one that matters.

## The Hobby-plan caveat (important)

Vercel's plan tiers cap cron differently:

| Plan       | Cron behaviour                                                    |
|------------|-------------------------------------------------------------------|
| Hobby      | At most **one run per day**, regardless of the schedule you write |
| Pro ($20)  | Runs the schedule as written                                      |

If StatDoctor is on Hobby, the `*/15` in `vercel.json` will silently downgrade
to a single daily run, which is not enough to keep the function warm.

### Workaround on Hobby plan

Point an external pinger at `https://<domain>/api/chat` every 15 min:

- **cron-job.org** — free, web UI, 1-min minimum interval.
- **UptimeRobot** — free, 5-min minimum, also gives uptime monitoring as a
  bonus.
- **GitHub Actions** scheduled workflow — free for public repos, runs on
  GitHub's infra:

  ```yaml
  # .github/workflows/warmup.yml
  on:
    schedule:
      - cron: "*/15 * * * *"
  jobs:
    ping:
      runs-on: ubuntu-latest
      steps:
        - run: curl -fsS https://statdoctor.net/api/chat
  ```

## Realistic impact

- Vercel Node serverless cold-start: **200-800 ms**.
- OpenAI first-token latency (warm or cold): **500-2000 ms**.
- Warming shaves the cold-start delta off the **first message after idle**,
  not every message. Subsequent messages within the same session are already
  warm.
- This is a small win compared to genuine UX problems (e.g. the third-party
  QR fetch that previously added multi-second delays — fixed by inlining the
  SVG in `components/DownloadModal.tsx`).

## How to verify it's working

After deploying:

```bash
# First call after idle — should be ~300-800 ms on cold lambda
curl -sS -o /dev/null -w "%{time_total}s\n" https://statdoctor.net/api/chat

# Immediately again — should be <100 ms warm
curl -sS -o /dev/null -w "%{time_total}s\n" https://statdoctor.net/api/chat
```

In the Vercel dashboard, under **Logs → Functions**, look for regular hits to
`/api/chat` from the `Vercel Cron` user-agent every 15 min (or daily if on
Hobby).

## How to turn it off

Either:
- Remove the entry from `vercel.json`'s `crons` array, or
- Remove the `GET` export from `app/api/chat/route.ts` (the handler is what
  defines the warm path; without it, the cron will hit POST-only and 405).
