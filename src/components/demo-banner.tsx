export function DemoBanner() {
  return (
    <div
      className="bg-accent text-accent-fg overflow-hidden py-2"
      role="status"
      aria-label="Demo preview — soyouwannabeacreator isn't live yet"
    >
      <div className="marquee-track flex gap-8 whitespace-nowrap">
        <span className="block flex-shrink-0">
          Demo preview — soyouwannabeacreator isn't live yet. This is a work-in-progress waitlist.
        </span>
        <span className="block flex-shrink-0" aria-hidden="true">
          Demo preview — soyouwannabeacreator isn't live yet. This is a work-in-progress waitlist.
        </span>
      </div>
    </div>
  );
}
