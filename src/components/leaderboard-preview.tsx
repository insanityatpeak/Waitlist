import {
  BadgeCheck,
  Camera,
  Mail,
  MessageCircle,
  MousePointerClick,
  Play,
  Radio,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CATEGORIES, categoryBySlug } from "@/lib/categories";
import {
  PREVIEW_ACTIVITY,
  PREVIEW_LISTINGS,
  type PreviewListing,
} from "@/lib/preview-listings";
import { cn, formatCompact, formatDollars } from "@/lib/utils";

const PLATFORM_ICON = {
  youtube: Play,
  instagram: Camera,
  tiktok: Play,
  twitch: Radio,
  x: MessageCircle,
  substack: Mail,
} as const;

function PlatformDot({ platform }: { platform: PreviewListing["platform"] }) {
  const Icon = PLATFORM_ICON[platform];
  return (
    <span className="absolute -right-1 -bottom-1 grid size-4 place-items-center rounded-full bg-surface text-fg shadow-[var(--shadow-border)]">
      <Icon className="size-2.5 text-accent" />
    </span>
  );
}

function Avatar({ listing, size = "md" }: { listing: PreviewListing; size?: "md" | "sm" }) {
  return (
    <span
      className={cn(
        "relative shrink-0 overflow-hidden rounded-lg",
        size === "md" ? "size-12" : "size-10",
      )}
    >
      <span
        className="grid size-full place-items-center font-display text-sm font-semibold text-accent-fg"
        style={{ backgroundColor: listing.tint }}
      >
        {listing.initials}
      </span>
      <PlatformDot platform={listing.platform} />
    </span>
  );
}

function ListingMeta({ listing }: { listing: PreviewListing }) {
  const cat = categoryBySlug(listing.categorySlug);
  const Icon = cat?.icon;
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
      <span>{listing.ago}</span>
      <span className="text-subtle">·</span>
      {Icon ? <Icon className="size-3 text-accent" /> : null}
      <span>{cat?.name}</span>
      <span className="text-subtle">·</span>
      <span className="inline-flex items-center gap-1">
        <span className="size-1.5 rounded-full bg-live" />
        <MousePointerClick className="size-3" />
        {formatCompact(listing.clicks)}
      </span>
      <span className="text-subtle">·</span>
      <span>{listing.followers}</span>
    </div>
  );
}

function ListingBody({ listing }: { listing: PreviewListing }) {
  return (
    <>
      <div className="flex items-center gap-1.5">
        <p className="font-display text-base font-semibold tracking-tight text-fg">
          {listing.name}
        </p>
        {listing.verified ? (
          <BadgeCheck className="size-4 text-accent" aria-label="Verified" />
        ) : null}
      </div>
      <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-muted">
        {listing.bio}
      </p>
      <p className="mt-0.5 text-xs text-subtle">@{listing.handle}</p>
      <ListingMeta listing={listing} />
    </>
  );
}

export function LeaderboardPreview() {
  const top3 = PREVIEW_LISTINGS.slice(0, 3);
  const rest = PREVIEW_LISTINGS.slice(3);

  return (
    <section id="board" className="mx-auto max-w-5xl px-4 sm:px-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            Sample board
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-fg">
            This is what rank looks like.
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted">
          Highest bid holds #1. The real board opens with the waitlist — these
          rows are a preview, not live money.
        </p>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="inline-flex shrink-0 items-center rounded-pill bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg">
          All
        </span>
        {CATEGORIES.slice(0, 10).map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-pill bg-surface px-3 py-1.5 text-xs font-medium text-fg no-underline shadow-[var(--shadow-border)] transition-shadow duration-[var(--motion-quick)] hover:shadow-[var(--shadow-border-hover)]"
            >
              <Icon className="size-3.5 text-accent" />
              {c.name.replace(" Creators", "")}
            </Link>
          );
        })}
      </div>

      <div className="space-y-3">
        {top3.map((listing) => (
          <article
            key={listing.handle}
            className="flex items-start gap-3 rounded-2xl bg-peach px-4 py-4 shadow-[var(--shadow-border)] sm:gap-4 sm:px-5"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent font-display text-sm font-bold text-accent-fg">
              #{listing.rank}
            </span>
            <Avatar listing={listing} />
            <div className="min-w-0 flex-1">
              <ListingBody listing={listing} />
            </div>
            <p className="shrink-0 font-display text-lg font-semibold tabular-nums text-accent sm:text-xl">
              {formatDollars(listing.bid)}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="mb-3 font-display text-lg font-semibold tracking-tight">
          Latest activity
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PREVIEW_ACTIVITY.map((item) => (
            <div
              key={item.handle}
              className="inline-flex shrink-0 items-center gap-2 rounded-pill bg-surface px-3 py-2 text-xs shadow-[var(--shadow-border)]"
            >
              <span className="font-medium text-fg">@{item.handle}</span>
              <span className="text-muted">
                #{item.rank} · {formatDollars(item.bid)}
              </span>
              <span className="text-subtle">{item.ago}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 divide-y divide-border">
        {rest.map((listing) => (
          <article
            key={listing.handle}
            className="flex items-start gap-3 py-4 sm:gap-4"
          >
            <span className="w-8 shrink-0 pt-2 text-right font-display text-sm font-semibold text-muted tabular-nums">
              {listing.rank}
            </span>
            <Avatar listing={listing} size="sm" />
            <div className="min-w-0 flex-1">
              <ListingBody listing={listing} />
            </div>
            <p className="shrink-0 font-display text-lg font-semibold tabular-nums text-accent">
              {formatDollars(listing.bid)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
