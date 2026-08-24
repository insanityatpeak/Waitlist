import { Link, useRouterState } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Waitlist" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/rules", label: "Rules" },
] as const;

function LogoMark() {
  return (
    <span className="grid size-7 place-items-center rounded-full bg-accent text-[11px] font-bold text-accent-fg font-display leading-none">
      #1
    </span>
  );
}

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-fg no-underline"
          aria-label="so you wanna be a creator home"
        >
          <LogoMark />
          <span className="font-display text-[12px] font-semibold tracking-tight sm:text-base">
            soyouwannabeacreator
          </span>
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1">
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-2 py-1 text-[13px] text-muted no-underline transition-colors duration-[var(--motion-quick)] hover:text-fg sm:px-2.5 sm:text-sm",
                  item.to === "/" && "hidden sm:inline",
                  active && "text-fg shadow-[0_0_0_1px_var(--color-border)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
