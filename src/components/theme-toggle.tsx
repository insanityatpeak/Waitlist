import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function isDark() {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(isDark());
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="iconSm"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="text-muted hover:text-fg"
    >
      <span className="relative size-4">
        <Sun
          className={`absolute inset-0 size-4 transition-[opacity,transform,filter] duration-[var(--motion-fast)] ease-[var(--ease-out)] ${
            dark
              ? "scale-[0.25] opacity-0 blur-[4px]"
              : "scale-100 opacity-100 blur-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 size-4 transition-[opacity,transform,filter] duration-[var(--motion-fast)] ease-[var(--ease-out)] ${
            dark
              ? "scale-100 opacity-100 blur-0"
              : "scale-[0.25] opacity-0 blur-[4px]"
          }`}
        />
      </span>
    </Button>
  );
}
