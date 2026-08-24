import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-pill bg-surface px-4 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-subtle outline-none transition-[box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus:shadow-[var(--shadow-border-hover)] focus:outline-2 focus:outline-offset-2 focus:outline-accent",
        className,
      )}
      {...props}
    />
  );
}
