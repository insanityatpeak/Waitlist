import { AtSign, Check, Copy, Loader2, Mail } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCompact } from "@/lib/utils";
import { joinWaitlist } from "@/lib/waitlist";

export type Spot = {
  handle: string;
  referralCode: string;
  position: number;
  referrals: number;
  total: number;
  alreadyJoined?: boolean;
};

type Props = {
  initialSpot: Spot | null;
  total: number;
  onJoined?: (result: Spot) => void;
};

function referralFromUrl() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("ref") ?? "";
}

export function WaitlistForm({ initialSpot, total, onJoined }: Props) {
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [refCode, setRefCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spot, setSpot] = useState<Spot | null>(initialSpot);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setRefCode(referralFromUrl());
  }, []);

  const sharePath = useMemo(() => {
    if (!spot) return "";
    return `/?ref=${spot.referralCode}`;
  }, [spot]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = await joinWaitlist({
        data: {
          email,
          handle,
          referralCode: refCode || undefined,
          website: honeypot,
        },
      });
      const next: Spot = {
        handle: result.handle,
        referralCode: result.referralCode,
        position: result.position,
        referrals: result.referrals,
        total: result.total,
        alreadyJoined: result.alreadyJoined,
      };
      setSpot(next);
      onJoined?.(next);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not join. Try again.";
      setError(message.replace(/^.*?Error:\s*/, ""));
    } finally {
      setBusy(false);
    }
  }

  async function copyLink() {
    if (!spot) return;
    const url = `${window.location.origin}/?ref=${spot.referralCode}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Could not copy — select the link instead.");
    }
  }

  if (spot) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-7">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
          {spot.alreadyJoined ? "You are already on the list" : "You are in"}
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-fg">
          @{spot.handle} is #{spot.position}
          <span className="text-muted"> of {formatCompact(spot.total)}</span>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Refer friends to climb the waitlist. First-come tiebreak, same as the
          live board. Top referrers get first bid when we open.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <div className="min-w-0 flex-1 truncate rounded-pill bg-bg px-4 py-3 text-sm text-fg shadow-[var(--shadow-border)]">
            {sharePath}
          </div>
          <Button type="button" onClick={copyLink} className="shrink-0">
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
        <p className="mt-3 text-center text-xs text-subtle">
          {spot.referrals} referral{spot.referrals === 1 ? "" : "s"} so far
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Handle or profile link</span>
          <AtSign className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" />
          <Input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="Your handle or profile link"
            required
            autoComplete="username"
            className="pl-10"
          />
        </label>
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Email</span>
          <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email for launch"
            required
            autoComplete="email"
            className="pl-10"
          />
        </label>
        <Button type="submit" size="lg" disabled={busy} className="sm:px-7">
          {busy ? <Loader2 className="size-4 animate-spin" /> : null}
          {busy ? "Reserving" : "Reserve my spot"}
        </Button>
      </div>
      <input
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />
      {error ? (
        <p className="mt-3 text-center text-sm text-accent" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-3 text-center text-xs text-subtle">
          {formatCompact(total)} already in line. Re-entering the same email
          shows your current rank.
        </p>
      )}
    </form>
  );
}
