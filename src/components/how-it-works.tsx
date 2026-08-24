const STEPS = [
  {
    n: "01",
    title: "One bid, one rank",
    body: "Highest bid on a listing holds #1. New listings start at $5, whole dollars, $1 at a time.",
  },
  {
    n: "02",
    title: "Take #1 for a dollar more",
    body: "To take the top spot you bid at least $1 above the current #1. Bidding less still places you wherever that amount can reach.",
  },
  {
    n: "03",
    title: "Top up your own listing",
    body: "Re-enter the same handle to raise it. You’re charged only the difference. Nobody else can steal a rank by paying that gap.",
  },
  {
    n: "04",
    title: "No refunds when you get bumped",
    body: "Payment is final the moment a claim lands. That’s the point — it starts bidding wars. Equal bids: the older one keeps the higher rank.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-5xl px-4 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        How ranking works
      </p>
      <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-fg">
        Rank is the bid — nothing else.
      </h2>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {STEPS.map((step) => (
          <article
            key={step.n}
            className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6"
          >
            <p className="font-display text-sm font-semibold tabular-nums text-accent">
              {step.n}
            </p>
            <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-fg">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
