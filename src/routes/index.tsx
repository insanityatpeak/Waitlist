import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CategoryGrid } from "@/components/category-grid";
import { ClaimHero } from "@/components/claim-hero";
import { HowItWorks } from "@/components/how-it-works";
import { LeaderboardPreview } from "@/components/leaderboard-preview";
import { ReferralBoard } from "@/components/referral-board";
import { PageShell } from "@/components/site-footer";
import type { Spot } from "@/components/waitlist-form";
import { getMySpot, getWaitlistStats } from "@/lib/waitlist";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [stats, mine] = await Promise.all([getWaitlistStats(), getMySpot()]);
    return { stats, mine };
  },
  component: Home,
});

function Home() {
  const { stats, mine } = Route.useLoaderData();
  const [total, setTotal] = useState(stats.total);
  const [recent, setRecent] = useState(stats.recent);

  useEffect(() => {
    setTotal(stats.total);
    setRecent(stats.recent);
  }, [stats]);

  function onJoined(spot: Spot) {
    setTotal(spot.total);
    setRecent((prev) =>
      [
        {
          handle: spot.handle,
          referrals: 0,
          createdAt: new Date().toISOString(),
          ago: "just now",
        },
        ...prev.filter((p) => p.handle !== spot.handle),
      ].slice(0, 8),
    );
  }

  const initialSpot: Spot | null = mine
    ? {
        handle: mine.handle,
        referralCode: mine.referralCode,
        position: mine.position,
        referrals: mine.referrals,
        total: mine.total,
        alreadyJoined: true,
      }
    : null;

  return (
    <PageShell>
      <ClaimHero total={total} initialSpot={initialSpot} onJoined={onJoined} />
      <LeaderboardPreview />
      <div className="mt-20">
        <HowItWorks />
      </div>
      <div className="mt-20">
        <ReferralBoard top={stats.top} recent={recent} />
      </div>
      <div className="mt-20">
        <CategoryGrid />
      </div>
      <RevenueBlock />
    </PageShell>
  );
}

function RevenueBlock() {
  return (
    <section className="mx-auto mt-24 max-w-5xl px-4 text-center sm:px-6">
      <p className="text-muted">
        This{" "}
        <Link to="/about" className="font-medium text-accent no-underline hover:underline">
          simple side project
        </Link>{" "}
        made
      </p>
      <div className="mx-auto mt-4 max-w-md rounded-2xl bg-surface px-6 py-8 shadow-[var(--shadow-border)]">
        <p className="font-display text-5xl font-semibold tracking-tight text-fg">
          <span className="text-accent">$</span>0
        </p>
        <p className="mt-2 text-sm text-muted">since it hasn’t launched yet</p>
      </div>
    </section>
  );
}