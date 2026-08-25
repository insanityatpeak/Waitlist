import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { HowItWorks } from "@/components/how-it-works";
import { PageShell } from "@/components/site-footer";
import { WaitlistForm, type Spot } from "@/components/waitlist-form";
import { categoryBySlug } from "@/lib/categories";
import { PREVIEW_LISTINGS } from "@/lib/preview-listings";
import { formatDollars } from "@/lib/utils";
import { getMySpot, getWaitlistStats } from "@/lib/waitlist";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params }) => {
    const category = categoryBySlug(params.slug);
    if (!category) throw notFound();
    const [stats, mine] = await Promise.all([getWaitlistStats(), getMySpot()]);
    const listings = PREVIEW_LISTINGS.filter(
      (l) => l.categorySlug === params.slug,
    );
    // Only serializable values may cross the loader boundary. `category.icon`
    // is a React component, and dehydrating it throws SerovalUnsupportedType,
    // which blanks the page on hydration — pass the slug and look the icon up
    // in the component instead.
    return { slug: category.slug, name: category.name, stats, mine, listings };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <PageShell>
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">No such category</h1>
        <p className="mt-3 text-muted">
          That board doesn’t exist.{" "}
          <Link to="/categories" className="text-accent hover:underline">
            See all categories
          </Link>
        </p>
      </main>
    </PageShell>
  ),
});

function CategoryPage() {
  const { slug, name, stats, mine, listings } = Route.useLoaderData();
  const Icon = categoryBySlug(slug)?.icon;
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
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
          Category
        </p>
        <div className="mt-3 flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-full bg-peach">
            {Icon ? <Icon className="size-5 text-accent" /> : null}
          </span>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            {name}
          </h1>
        </div>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
          This board opens at launch. Same mechanic as the global list: highest
          bid holds #1, $5 to start, $1 increments. Reserve a waitlist spot to
          bid here first.
        </p>

        <div className="mt-8">
          <WaitlistForm initialSpot={initialSpot} total={stats.total} />
        </div>

        {listings.length > 0 ? (
          <div className="mt-12">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
              Sample rows
            </p>
            <div className="mt-4 divide-y divide-border">
              {listings.map((l) => (
                <article
                  key={l.handle}
                  className="flex items-start justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-display font-semibold text-fg">{l.name}</p>
                    <p className="text-sm text-muted">@{l.handle}</p>
                  </div>
                  <p className="font-display text-lg font-semibold tabular-nums text-accent">
                    {formatDollars(l.bid)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-12 rounded-2xl bg-peach px-5 py-6 text-sm text-muted">
            No sample rows in this category yet — it’ll be an open field on day
            one.
          </p>
        )}
      </main>
      <div className="pb-8">
        <HowItWorks />
      </div>
    </PageShell>
  );
}
