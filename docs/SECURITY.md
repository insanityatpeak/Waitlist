# Security & data handling

## What's collected

From the waitlist form (`src/lib/waitlist.ts`): email, a handle, an optional
referral code you were referred by, and a timestamp. A random referral code
is generated for you and stored in an `httpOnly` cookie (`sywbac_code`) so
returning to the site recognizes you without an account. No passwords, no
phone numbers, no analytics/tracking scripts are collected.

## Where it lives

Neon Postgres, in the `waitlist` table (`migrations/0002_waitlist.sql`).
Stored as plaintext — intentional, since handles/ranks are meant to be
publicly visible on the leaderboard (only the email column is not shown
publicly). Access is gated entirely by the `DATABASE_URL` secret; there is no
admin panel or second read path.

## Protections in place

- **Every query is parameterized** (`src/lib/db.ts`, `src/lib/waitlist.ts`
  use tagged-template `sql` calls throughout) — no string-concatenated SQL,
  so no SQL injection surface.
- **Server-side validation**, not just client-side: `joinSchema` (zod) caps
  email/handle length, and the handle is additionally checked against
  `/^[a-z0-9][a-z0-9._-]{1,38}$/` after normalization.
- **Honeypot field** (`website`) silently rejects basic bots.
- **Rate limiting** on the join endpoint: 5 attempts/min per email, 20/min
  per IP (see `docs/DEPLOYMENT.md` for the scaling caveat on this).
- **Security headers** on every HTML response (`server/middleware/grok-pwa.ts`):
  `Content-Security-Policy`, `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
  `Strict-Transport-Security`, `Permissions-Policy`.
- **No secrets in the client bundle** — only `VITE_`-prefixed env vars reach
  the browser; `DATABASE_URL` and auth secrets are server-only.
- **HTTPS enforced** by Vercel at the edge, plus `Strict-Transport-Security`
  from the app itself.
- Cookies set `httpOnly` + `sameSite: lax`.

## Known trade-offs (accepted, not oversights)

- **No email verification.** Anyone can submit a syntactically valid email
  that isn't theirs. Acceptable for a pre-launch waitlist; revisit if fake
  signups become a real problem.
- **Re-submitting a known email returns that email's existing spot** (handle,
  rank, referral code). This is a deliberate product feature — "enter your
  email again to see where you rank" — not a bug, but it does mean an
  attacker who already knows an email can confirm it's on the list. Rate
  limiting (5/min per email) is the mitigation, not response-shape hiding,
  because hiding it would break the legitimate re-check flow.
- **In-memory rate limiter**, not distributed. See `docs/DEPLOYMENT.md`.

## Reporting a problem

If you find an actual vulnerability (not the trade-offs above), don't open a
public issue — email the address in the site footer / rules page first so it
can be fixed before it's public.
