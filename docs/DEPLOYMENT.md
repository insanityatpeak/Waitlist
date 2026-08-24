# Deployment Guide

## Prerequisites

1. A **Neon Postgres** database — https://neon.tech (free tier is enough for a waitlist)
2. A **Vercel** account — https://vercel.com
3. This repo pushed to a Git provider (GitHub/GitLab/Bitbucket) Vercel can import from

## 1. Create the database

1. Create a Neon project.
2. Copy the connection string (`postgresql://...?sslmode=require`).
3. Keep it secret — it goes into Vercel's environment variables, never into a
   committed file. `migrations/0002_waitlist.sql` and `migrations/auth/0001_auth.sql`
   are applied automatically by `npm run db:migrate` (which runs as part of
   `npm run build`, see `package.json`) — you don't need to run SQL by hand.

## 2. Import into Vercel

1. https://vercel.com/new -> import this repo.
2. Vercel will detect the build command from `vercel.json`
   (`npm run build` / `npm run dev` / `npm install`).
3. Add environment variables (Project Settings -> Environment Variables):
   - `DATABASE_URL` = the Neon connection string from step 1
   - `VITE_AUTH_ENABLED` = `false`
4. Deploy. Vercel builds with `node scripts/with-app-env.mjs vite build`, which
   also runs `npm run db:migrate` against `DATABASE_URL` before the build
   completes — check the deploy log for `[migrate]` output to confirm the
   `waitlist` table was created.
5. Add your custom domain under Project Settings -> Domains. Vercel issues the
   TLS cert and redirects `http://` -> `https://` automatically — no extra
   config needed for that part.

## 3. Verify

- Visit the deployed URL, submit the waitlist form with a real email, and
  confirm the row shows up in Neon's SQL console (`select * from waitlist
  order by created_at desc limit 5;`).
- Confirm security headers are present:
  ```
  curl -I https://your-domain.com
  ```
  Look for `content-security-policy`, `x-frame-options: DENY`,
  `strict-transport-security` (set in `server/middleware/grok-pwa.ts`).
- Submit the form 6+ times quickly with the same email — the 6th+ attempt
  within a minute should get "Too many attempts..." (rate limiting in
  `src/lib/waitlist.ts`).

## Notes on scale / known limitations

- **Rate limiting is in-memory** (`src/lib/waitlist.ts`), scoped to a single
  warm serverless instance. It blunts casual spam/scripted abuse but resets on
  cold start and isn't shared across concurrent instances. If abuse becomes a
  real problem, swap it for Upstash Redis (`@upstash/ratelimit`) — the
  function shape (`hitRateLimit`) is a drop-in point for that.
- **No email verification** — any syntactically valid email is accepted. Add
  a confirm-link flow if fake signups become an issue.
- Auth (`src/lib/auth/`) and its migration (`migrations/auth/0001_auth.sql`)
  are wired but dormant (`VITE_AUTH_ENABLED=false`). Leave them off unless
  you're deliberately adding accounts — see `scripts/check-auth-invariant.mjs`.

## Backups

Neon takes automatic point-in-time backups. To restore: Neon console ->
Backups -> pick a timestamp -> restore to a new branch -> verify -> promote.
