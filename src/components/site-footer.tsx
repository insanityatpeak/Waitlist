import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { DemoBanner } from "@/components/demo-banner";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border py-10">
      <p className="mx-auto max-w-5xl px-4 text-center text-sm text-muted sm:px-6">
        Built by Priyanshu
        {" "}
        <a
          href="https://x.com/DragonE17010245"
          target="_blank"
          rel="noreferrer"
          aria-label="Priyanshu on X"
          className="text-accent hover:text-fg inline-flex items-center"
        >
          <svg
            className="size-3.5 mx-1"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.654l-5.207-6.807-5.989 6.807H2.423l7.723-8.835L1.029 2.25h6.885l4.707 6.225 5.45-6.225zM17.15 18.75h1.828L6.122 3.883H4.231l12.919 14.867z" />
          </svg>
        </a>
        ·{" "}
        <Link to="/rules" className="text-accent no-underline hover:underline">
          Rules
        </Link>{" "}
        ·{" "}
        <Link to="/about" className="text-accent no-underline hover:underline">
          About
        </Link>
      </p>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-bg text-fg">
      <div className="paper-grain pointer-events-none absolute inset-0 opacity-80" />
      <div className="relative">
        <DemoBanner />
        <SiteHeader />
        {children}
        <SiteFooter />
      </div>
    </div>
  );
}
