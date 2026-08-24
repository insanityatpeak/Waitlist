import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-footer";

export const Route = createFileRoute("/rules")({ component: RulesPage });

function RulesPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          Rules.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted">
          <span className="font-medium text-fg">so you wanna be a creator</span>{" "}
          is a public leaderboard for creators. There are no ads, no API keys,
          and no revenue share. You pay to stand above other creators. Rank is
          the bid — nothing else.
        </p>

        <h2 className="mt-12 font-display text-2xl font-semibold tracking-tight">
          How ranking works
        </h2>
        <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted">
          <li>
            New listings are whole US dollars, $5 minimum, $999,999 maximum, $1
            at a time. Bids already on the board keep their amount until they
            raise or get outranked.
          </li>
          <li>
            Taking #1 costs at least $1 more than the current top bid. Paying
            less still puts you on the board at whatever rank that bid can take.
            Equal bids stay in the order they were placed — the older bid keeps
            the higher rank.
          </li>
          <li>
            Enter the same handle/profile link again to raise that listing to
            any rank. The new bid must be at least $1 above the current bid;
            only the difference is charged. No one else can take that rank by
            paying the difference.
          </li>
          <li>
            Platform links are keyed by their canonical path (e.g. a YouTube
            channel ID), so the same channel can’t be listed twice under
            different URL variants. Tracking query strings are ignored.
          </li>
        </ul>

        <h2 className="mt-12 font-display text-2xl font-semibold tracking-tight">
          What you can list
        </h2>
        <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted">
          <li>
            A creator’s platform profile/channel link (YouTube, Instagram,
            TikTok, Twitch, X, Substack, podcast page) or a verified handle.
          </li>
          <li>
            No chat/invite links: Discord, Telegram, WhatsApp, Messenger,
            Signal, or similar — the board is for creator profiles, not group
            chats.
          </li>
          <li>
            <span className="font-medium text-fg">No adult-platform links</span>{" "}
            (OnlyFans, adult content, NSFW). Hard rule, not a guideline.
          </li>
          <li>
            Query parameters and affiliate/tracking params are stripped from all
            listing links. Link shorteners are not allowed — we resolve to the
            final destination URL before storing.
          </li>
          <li>
            Platform links are keyed by their canonical path so the same channel
            can’t be listed twice under different URL variants.
          </li>
        </ul>

        <h2 className="mt-12 font-display text-2xl font-semibold tracking-tight">
          Categories
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Category is auto-assigned from the platform link; creators can flag
          miscategorization via{" "}
          <a
            href="mailto:hello@soyouwannabeacreator.com"
            className="text-accent no-underline hover:underline"
          >
            hello@soyouwannabeacreator.com
          </a>
          . Browse them on the{" "}
          <Link to="/categories" className="text-accent no-underline hover:underline">
            categories
          </Link>{" "}
          page.
        </p>

        <h2 className="mt-12 font-display text-2xl font-semibold tracking-tight">
          After you pay
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          The listing is public immediately. Click-throughs go to the submitted
          link without query parameters. A completed payment is what claims the
          rank — not an optimistic write before the charge lands.
        </p>
        <p className="mt-6 text-[15px] leading-relaxed text-muted">
          The board isn’t taking bids yet.{" "}
          <Link to="/" className="text-accent no-underline hover:underline">
            Join the waitlist
          </Link>{" "}
          to get first bid when it opens.
        </p>
      </main>
    </PageShell>
  );
}
