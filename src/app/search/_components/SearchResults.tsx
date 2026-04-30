import { cacheLife, cacheTag } from "next/cache";
import ProductCard from "@/components/ProductCard";
import { fetchProductsForSearchRoute } from "@/lib/storeApi/products";

type SearchResultsProps = {
  query?: string;
  category?: string;
};

const SearchResults = async ({
  query: rawQuery,
  category: rawCategory,
}: SearchResultsProps) => {
  "use cache";
  cacheLife("store-catalog");
  cacheTag("store-products", "product-search");

  const category = rawCategory?.trim() || "All";
  const query = rawQuery?.trim();

  const { hasSearchQuery, products } = await fetchProductsForSearchRoute(
    query || undefined,
    category,
  );

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="font-display text-xl font-bold uppercase tracking-wider text-muted-foreground">
          No results found
        </p>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {hasSearchQuery
            ? "Try a different search term or category."
            : "Nothing in this category right now."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          imagePriority={index < 5}
        />
      ))}
    </div>
  );
};

export default SearchResults;
