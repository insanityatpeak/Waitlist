import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-footer";
import { formatCompact } from "@/lib/utils";
import { getWaitlistStats } from "@/lib/waitlist";

export const Route = createFileRoute("/about")({
  loader: () => getWaitlistStats(),
  component: AboutPage,
});

function AboutPage() {
  const stats = Route.useLoaderData();

  return (
    <PageShell>
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          About.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-fg">
          so you wanna be a creator started as{" "}
          <span className="text-accent">a simple side project</span>: no ads, no
          API keys, no revenue sharing. Just outbid your competitors to rank #1
          as a creator — that’s it.
        </p>

        <h2 className="mt-10 font-display text-xl font-semibold tracking-tight">
          Then it went live,
        </h2>
        <p className="mt-2 text-[15px] text-muted">
          Launch is still ahead of us. The waitlist is open now.
        </p>

        <p className="mt-8 text-[15px] text-fg">
          A few things already in motion:
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <StatCard label="on the waitlist" value={formatCompact(stats.total)} live />
          <StatCard label="revenue so far" value="0" money />
          <StatCard
            label="highest bid (so far)"
            value="847"
            hint="preview · @maya.lifts"
            money
          />
        </div>

        <p className="mt-10 text-[15px] leading-relaxed text-muted">
          Here’s what’s happened since we started building — check back as this
          grows. The live board, seasons, outbid mail, and sponsor-a-rising-creator
          all ship after launch. Until then, rank on the waitlist is referrals.
        </p>
        <p className="mt-6 text-[15px] leading-relaxed text-fg">
          The board is still here. Same rules. Same idea. Rank is the bid —
          nothing else.
        </p>

        <div className="mt-12 flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-accent font-display text-lg font-bold text-accent-fg">
            P
          </span>
          <div>
            <p className="font-display font-semibold text-fg">
              Priyanshu —{" "}
              <span className="text-accent">@soyouwannabeacreator</span>
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Building a public leaderboard for creators, in public. Rank is the
              bid.
            </p>
          </div>
        </div>

        <p className="mt-10 text-sm text-muted">
          Ready?{" "}
          <Link to="/" className="text-accent no-underline hover:underline">
            Join the waitlist →
          </Link>
        </p>
      </main>
    </PageShell>
  );
}

function StatCard({
  label,
  value,
  hint,
  live,
  money,
}: {
  label: string;
  value: string;
  hint?: string;
  live?: boolean;
  money?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-surface p-4 text-left shadow-[var(--shadow-border)]">
      <p className="flex items-center gap-1.5 text-xs text-muted">
        {live ? <span className="live-dot" /> : null}
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-fg tabular-nums">
        {money ? <span className="text-accent">$</span> : null}
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-subtle">{hint}</p> : null}
    </div>
  );
}
