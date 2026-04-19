import { Loader2, Search as SearchIcon } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/storeApi/fetchProducts";

const categories = ["All", "Category 1", "Category 2", "Category 3"];
const loading = false;

// active filtered category
const category = "All";

const displayResults = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const query = "";

const SearchPage = async () => {
  const products = await fetchProducts();

  return (
    <div className="container mx-auto pt-24 pb-20">
      <h1 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl mb-10">
        Search
      </h1>

      {/* Search form */}
      <form className="mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            placeholder="Search products..."
            className="h-14 w-full border border-border bg-secondary pl-12 pr-4 font-display text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:neon-border transition-all"
          />
        </div>
      </form>

      {/* Category filter */}
      <div className="mb-10 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            type="button"
            key={cat}
            // onClick={() => handleCategoryChange(cat)}
            className={`border px-4 py-2 font-display text-xs font-semibold uppercase tracking-widest transition-all ${
              category === cat
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : displayResults.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              imagePriority={index < 5}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="font-display text-xl font-bold uppercase tracking-wider text-muted-foreground">
            No results found
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search term or category.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
