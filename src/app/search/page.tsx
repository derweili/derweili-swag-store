import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchProductCategories } from "@/lib/storeApi/products";
import SearchControls from "./_components/SearchControls";
import SearchControlsSkeleton from "./_components/SearchControlsSkeleton";
import SearchResults from "./_components/SearchResults";
import SearchResultsSkeleton from "./_components/SearchResultsSkeleton";

export const metadata: Metadata = {
  title: "Search",
  description: "Search and filter products in our store.",
  robots: {
    index: false,
    follow: true,
  },
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

function resolveCategory(
  categoryParam: string | undefined,
  categories: string[],
): string {
  const trimmed = categoryParam?.trim();
  return trimmed && categories.includes(trimmed) ? trimmed : "All";
}

async function SearchShell({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const [resolved, categories] = await Promise.all([
    searchParams,
    fetchProductCategories(),
  ]);

  const query = (resolved.q ?? "").trim();
  const category = resolveCategory(resolved.category, categories);

  return (
    <>
      <SearchControls
        categories={categories}
        initialQuery={resolved.q ?? ""}
        initialCategory={category}
      />
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults query={query} category={category} />
      </Suspense>
    </>
  );
}

const SearchPage = ({ searchParams }: SearchPageProps) => (
  <div className="container mx-auto pt-24 pb-20">
    <h1 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl mb-10">
      Search
    </h1>
    <Suspense
      fallback={
        <>
          <SearchControlsSkeleton />
          <SearchResultsSkeleton />
        </>
      }
    >
      <SearchShell searchParams={searchParams} />
    </Suspense>
  </div>
);

export default SearchPage;
