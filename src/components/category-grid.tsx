import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/categories";

export function CategoryGrid({
  heading = true,
}: {
  heading?: boolean;
}) {
  return (
    <section id="categories" className="mx-auto max-w-5xl px-4 sm:px-6">
      {heading ? (
        <>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Categories
          </h2>
          <p className="mt-2 text-muted">
            Every category has its own ranking. Pick one to see who leads it.
          </p>
        </>
      ) : null}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="flex items-center gap-4 rounded-2xl bg-surface p-5 no-underline shadow-[var(--shadow-border)] transition-shadow duration-[var(--motion-quick)] hover:shadow-[var(--shadow-border-hover)]"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-peach">
                <Icon className="size-5 text-accent" />
              </span>
              <span className="font-display text-base font-semibold leading-snug text-fg">
                {c.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
