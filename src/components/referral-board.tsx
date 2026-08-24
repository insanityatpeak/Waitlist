import type { WaitlistPerson } from "@/lib/waitlist";

type Props = {
  top: WaitlistPerson[];
  recent: WaitlistPerson[];
};

function RankBadge({ n }: { n: number }) {
  if (n <= 3) {
    return (
      <span className="grid size-8 place-items-center rounded-full bg-accent font-display text-xs font-bold text-accent-fg">
        #{n}
      </span>
    );
  }
  return (
    <span className="grid size-8 place-items-center font-display text-sm font-semibold tabular-nums text-muted">
      {n}
    </span>
  );
}

export function ReferralBoard({ top, recent }: Props) {
  return (
    <section id="waitlist-ranks" className="mx-auto max-w-5xl px-4 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        Waitlist ranks
      </p>
      <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-fg">
        Skip the line. Refer friends.
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Same rules as the board: more referrals ranks you higher. Equal counts
        keep the older signup. Top of this list gets first bid when we open.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <ol className="divide-y divide-border rounded-2xl bg-surface px-2 shadow-[var(--shadow-border)] sm:px-4">
          {top.map((person, i) => (
            <li
              key={person.handle}
              className="flex items-center gap-3 py-3.5 sm:gap-4"
            >
              <RankBadge n={i + 1} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-semibold text-fg">
                  @{person.handle}
                </p>
                <p className="text-xs text-subtle">{person.ago}</p>
              </div>
              <p className="shrink-0 text-sm font-medium tabular-nums text-accent">
                {person.referrals}{" "}
                <span className="text-muted">
                  ref{person.referrals === 1 ? "" : "s"}
                </span>
              </p>
            </li>
          ))}
        </ol>

        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight">
            Just joined
          </h3>
          <ul className="mt-3 space-y-2">
            {recent.map((person) => (
              <li
                key={person.handle}
                className="flex items-center justify-between rounded-pill bg-peach px-4 py-2.5"
              >
                <span className="truncate text-sm font-medium text-fg">
                  @{person.handle}
                </span>
                <span className="shrink-0 pl-3 text-xs text-muted">
                  {person.ago}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-subtle">
            Handles only. Emails never appear on the board.
          </p>
        </div>
      </div>
    </section>
  );
}
