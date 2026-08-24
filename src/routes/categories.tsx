import { createFileRoute } from "@tanstack/react-router";
import { CategoryGrid } from "@/components/category-grid";
import { PageShell } from "@/components/site-footer";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <PageShell>
      <main className="py-12 sm:py-16">
        <CategoryGrid />
        <p className="mx-auto mt-10 max-w-5xl px-4 text-sm text-muted sm:px-6">
          Boards open at launch. Every category will have its own ranking — same
          rules, same $5 floor.
        </p>
      </main>
    </PageShell>
  );
}
