import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { timeAgo } from "@/lib/utils";

const COOKIE = "sywbac_code";
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const joinSchema = z.object({
  email: z.email().max(254),
  handle: z.string().trim().min(2).max(40),
  referralCode: z.string().trim().max(12).optional(),
  website: z.string().optional(),
});

export type WaitlistPerson = {
  handle: string;
  referrals: number;
  createdAt: string;
  ago: string;
};

export type WaitlistStats = {
  total: number;
  top: WaitlistPerson[];
  recent: WaitlistPerson[];
};

export type JoinResult = {
  ok: true;
  alreadyJoined: boolean;
  handle: string;
  referralCode: string;
  position: number;
  referrals: number;
  total: number;
};

function normalizeHandle(raw: string) {
  return raw.replace(/^@/, "").replace(/\s+/g, "").toLowerCase();
}

// Thrown for expected, user-facing conditions (bad handle, rate limited,
// already reserved) — the outer catch in joinWaitlist passes these through
// as-is. Anything else is treated as unexpected and sanitized before it
// reaches the client, so a raw driver/DB error message never leaks.
class WaitlistError extends Error {}

/** True when `err` is a Postgres unique-violation (23505), optionally on a specific constraint. */
function isUniqueViolation(err: unknown, constraint?: string): boolean {
  if (!(err instanceof Error)) return false;
  const code = (err as { code?: unknown }).code;
  if (code !== "23505") return false;
  if (!constraint) return true;
  return (err as { constraint?: unknown }).constraint === constraint;
}

// In-memory sliding-window rate limiter. This is a cheap FIRST PASS only:
// each serverless instance keeps its own Map and instances recycle, so the
// effective limit multiplies by the number of live instances. The enforcing
// limit belongs at the edge (Vercel Firewall) — see docs/SECURITY.md.
// Entries are swept so a flood of unique keys can't exhaust instance memory.
const RATE_WINDOW_MS = 60_000;
const MAX_RATE_KEYS = 10_000;
const rateBuckets = new Map<string, number[]>();

/** Drop keys whose hits have all aged out; clear outright as a last resort. */
function sweepRateBuckets(now: number) {
  for (const [key, times] of rateBuckets) {
    if (times.every((t) => now - t >= RATE_WINDOW_MS)) rateBuckets.delete(key);
  }
  if (rateBuckets.size > MAX_RATE_KEYS) rateBuckets.clear();
}

function hitRateLimit(key: string, max: number): boolean {
  const now = Date.now();
  if (rateBuckets.size > MAX_RATE_KEYS) sweepRateBuckets(now);
  const hits = (rateBuckets.get(key) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );
  if (hits.length >= max) {
    rateBuckets.set(key, hits);
    return true;
  }
  hits.push(now);
  rateBuckets.set(key, hits);
  return false;
}

async function requestIp(): Promise<string> {
  try {
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    // Vercel sets x-vercel-forwarded-for itself and strips any client-supplied
    // copy, so it can't be forged. Never trust the LEFTMOST x-forwarded-for
    // entry — that's the client-controlled position; when falling back, take
    // the rightmost (nearest-proxy) entry instead.
    const vercelIp = getRequestHeader("x-vercel-forwarded-for")?.trim();
    if (vercelIp) return vercelIp;
    const chain = getRequestHeader("x-forwarded-for");
    if (chain) {
      const parts = chain
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
      const nearest = parts[parts.length - 1];
      if (nearest) return nearest;
    }
    return getRequestHeader("x-real-ip")?.trim() || "unknown";
  } catch {
    return "unknown";
  }
}

function makeCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join(
    "",
  );
}

async function rememberCode(code: string) {
  const { setCookie } = await import("@tanstack/react-start/server");
  setCookie(COOKIE, code, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

async function rankForCode(code: string) {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<{ position: number; referrals: number; total: number }>`
    with counts as (
      select
        w.referral_code,
        w.created_at,
        coalesce(r.cnt, 0)::int as referrals
      from waitlist w
      left join (
        select referred_by_code as code, count(*)::int as cnt
        from waitlist
        where referred_by_code is not null
        group by referred_by_code
      ) r on r.code = w.referral_code
    ),
    ranked as (
      select
        referral_code,
        referrals,
        rank() over (order by referrals desc, created_at asc)::int as position
      from counts
    )
    select
      position,
      referrals,
      (select count(*)::int from waitlist) as total
    from ranked
    where referral_code = ${code}
  `;
  return rows[0] ?? { position: 0, referrals: 0, total: 0 };
}

// These stats are identical for every visitor and drive EVERY page load of
// /, /about and /category/:slug. Without this cache each of those requests
// scanned the whole table, which made plain GET traffic a cheap way to
// exhaust the database. One warm instance now serves many requests per query.
const STATS_TTL_MS = 15_000;
let statsCache: { at: number; value: WaitlistStats } | null = null;

export const getWaitlistStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<WaitlistStats> => {
    if (statsCache && Date.now() - statsCache.at < STATS_TTL_MS) {
      return statsCache.value;
    }
    try {
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const totals = await sql<{ n: number }>`select count(*)::int as n from waitlist`;
      // One grouped aggregate joined once, rather than a correlated subquery
      // re-counting referrals for every row.
      const top = await sql<{
        handle: string;
        referrals: number;
        created_at: string;
      }>`
        with ref_counts as (
          select referred_by_code as code, count(*)::int as cnt
          from waitlist
          where referred_by_code is not null
          group by referred_by_code
        )
        select
          w.handle,
          coalesce(r.cnt, 0)::int as referrals,
          w.created_at::text as created_at
        from waitlist w
        left join ref_counts r on r.code = w.referral_code
        order by referrals desc, w.created_at asc, w.id asc
        limit 10
      `;
      const recent = await sql<{ handle: string; created_at: string }>`
        select handle, created_at::text as created_at
        from waitlist
        order by created_at desc
        limit 8
      `;
      const value: WaitlistStats = {
        total: totals[0]?.n ?? 0,
        top: top.map((row) => ({
          handle: row.handle,
          referrals: row.referrals,
          createdAt: row.created_at,
          ago: timeAgo(row.created_at),
        })),
        recent: recent.map((row) => ({
          handle: row.handle,
          referrals: 0,
          createdAt: row.created_at,
          ago: timeAgo(row.created_at),
        })),
      };
      statsCache = { at: Date.now(), value };
      return value;
    } catch {
      // Prefer a stale snapshot over blanking the board on a transient failure.
      return statsCache?.value ?? { total: 0, top: [], recent: [] };
    }
  },
);

export const getMySpot = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { getCookie } = await import("@tanstack/react-start/server");
    const { getSql } = await import("@/lib/db");
    const code = getCookie(COOKIE);
    // The cookie is client-supplied, so reject anything that isn't a
    // well-formed code before spending a query on it. This path is not
    // cacheable (it's per-visitor) and rankForCode scans the table, so it
    // also gets a per-IP ceiling — generous enough for real browsing.
    if (!code || !/^[A-Z0-9]{8}$/.test(code)) return null;
    const ip = await requestIp();
    if (hitRateLimit(`spot:ip:${ip}`, 60)) return null;
    const sql = await getSql();
    const rows = await sql<{ handle: string; referral_code: string }>`
      select handle, referral_code from waitlist where referral_code = ${code} limit 1
    `;
    const row = rows[0];
    if (!row) return null;
    const rank = await rankForCode(row.referral_code);
    return {
      handle: row.handle,
      referralCode: row.referral_code,
      position: rank.position,
      referrals: rank.referrals,
      total: rank.total,
    };
  } catch {
    return null;
  }
});

export const joinWaitlist = createServerFn({ method: "POST" })
  .validator((data: unknown) => joinSchema.parse(data))
  .handler(async ({ data }): Promise<JoinResult> => {
    if (data.website && data.website.length > 0) {
      throw new WaitlistError("Rejected.");
    }

    const email = data.email.toLowerCase();
    const ip = await requestIp();

    // Per-IP: 20 join attempts/min (covers shared networks). Per-email: 5/min
    // (slows down enumeration probing a specific address).
    if (hitRateLimit(`join:ip:${ip}`, 20) || hitRateLimit(`join:email:${email}`, 5)) {
      throw new WaitlistError("Too many attempts. Please wait a moment and try again.");
    }

    const handle = normalizeHandle(data.handle);
    if (!/^[a-z0-9][a-z0-9._-]{1,38}$/.test(handle)) {
      throw new WaitlistError("Use a handle like maya.lifts — letters, numbers, dots.");
    }

    try {
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();

      const existingEmail = await sql<{ handle: string; referral_code: string }>`
        select handle, referral_code from waitlist where email = ${email} limit 1
      `;
      if (existingEmail[0]) {
        await rememberCode(existingEmail[0].referral_code);
        const rank = await rankForCode(existingEmail[0].referral_code);
        return {
          ok: true,
          alreadyJoined: true,
          handle: existingEmail[0].handle,
          referralCode: existingEmail[0].referral_code,
          position: rank.position,
          referrals: rank.referrals,
          total: rank.total,
        };
      }

      const existingHandle = await sql<{ n: number }>`
        select count(*)::int as n from waitlist where lower(handle) = ${handle}
      `;
      if ((existingHandle[0]?.n ?? 0) > 0) {
        throw new WaitlistError("That handle is already reserved on the waitlist.");
      }

      let referredBy: string | null = null;
      const incoming = data.referralCode?.toUpperCase().trim();
      if (incoming) {
        const ref = await sql<{ referral_code: string }>`
          select referral_code from waitlist where referral_code = ${incoming} limit 1
        `;
        referredBy = ref[0]?.referral_code ?? null;
      }

      let code = makeCode();
      for (let i = 0; i < 5; i += 1) {
        const clash = await sql<{ n: number }>`
          select count(*)::int as n from waitlist where referral_code = ${code}
        `;
        if ((clash[0]?.n ?? 0) === 0) break;
        code = makeCode();
      }

      try {
        await sql`
          insert into waitlist (email, handle, referral_code, referred_by_code)
          values (${email}, ${handle}, ${code}, ${referredBy})
        `;
      } catch (err) {
        // Two concurrent submissions for the same new email can both pass the
        // lookup above and race to insert — the loser hits the unique
        // constraint. Treat that exactly like "already joined" instead of
        // surfacing a raw DB error.
        if (isUniqueViolation(err, "waitlist_email_key")) {
          const winner = await sql<{ handle: string; referral_code: string }>`
            select handle, referral_code from waitlist where email = ${email} limit 1
          `;
          if (winner[0]) {
            await rememberCode(winner[0].referral_code);
            const rank = await rankForCode(winner[0].referral_code);
            return {
              ok: true,
              alreadyJoined: true,
              handle: winner[0].handle,
              referralCode: winner[0].referral_code,
              position: rank.position,
              referrals: rank.referrals,
              total: rank.total,
            };
          }
        }
        throw err;
      }

      await rememberCode(code);
      const rank = await rankForCode(code);
      return {
        ok: true,
        alreadyJoined: false,
        handle,
        referralCode: code,
        position: rank.position,
        referrals: rank.referrals,
        total: rank.total,
      };
    } catch (err) {
      if (err instanceof WaitlistError) throw err;
      console.error(
        "[waitlist] join failed:",
        err instanceof Error ? err.message : err,
      );
      throw new Error("Could not join right now — please try again.");
    }
  });
