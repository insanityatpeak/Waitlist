import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { WaitlistForm, type Spot } from "@/components/waitlist-form";
import { Button } from "@/components/ui/button";
import { formatCompact } from "@/lib/utils";

type Props = {
  total: number;
  initialSpot: Spot | null;
  onJoined?: (spot: Spot) => void;
};

export function ClaimHero({ total, initialSpot, onJoined }: Props) {
  const [amount, setAmount] = useState(5);

  return (
    <section className="mx-auto max-w-5xl px-4 pt-10 pb-12 text-center sm:px-6 sm:pt-16 sm:pb-16">
      <p className="mb-5 inline-flex items-center gap-2 rounded-pill bg-peach px-3 py-1 text-xs font-medium text-fg">
        <span className="live-dot" />
        {formatCompact(total)} on the waitlist · board opens soon
      </p>

      <div className="stagger-in">
        <h1 className="flex items-center justify-center gap-x-3 gap-y-3 font-display text-[clamp(1.7rem,4.2vw,3.05rem)] font-semibold leading-none tracking-[-0.03em] text-fg max-[720px]:flex-col">
          <span>Claim #1 for</span>
          <span className="inline-flex items-center gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Decrease preview bid"
              onClick={() => setAmount((n) => Math.max(5, n - 1))}
              className="size-10 sm:size-12"
            >
              <Minus className="size-4" />
            </Button>
            <span className="min-w-[2.4ch] font-display text-[clamp(2.1rem,6vw,3.6rem)] font-semibold tabular-nums text-accent">
              ${amount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Increase preview bid"
              onClick={() => setAmount((n) => Math.min(999, n + 1))}
              className="size-10 sm:size-12"
            >
              <Plus className="size-4" />
            </Button>
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          New listings start at{" "}
          <span className="font-semibold text-accent">$5</span>. Paying less
          than the #1 price still puts you on the board. The live board isn’t
          open yet — reserve a spot before it is.
        </p>
      </div>

      <div className="mt-8">
        <WaitlistForm
          initialSpot={initialSpot}
          total={total}
          onJoined={onJoined}
        />
      </div>
    </section>
  );
}
