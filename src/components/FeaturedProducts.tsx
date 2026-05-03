import ProductCard from "@/components/ProductCard";
import { fetchFeaturedProductsForHome } from "@/lib/storeApi/products";
import type { Product } from "@/lib/storeApi/schema/product";

const FeaturedProducts = async () => {
  let featuredProducts: Product[];
  try {
    featuredProducts = await fetchFeaturedProductsForHome();
  } catch (err) {
    console.error("[FeaturedProducts] Failed to load featured products:", err);
    return null;
  }

  return (
    <section className="py-20 px-2">
      <div className="container mx-auto">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-2">
              Curated Selection
            </p>
            <h2 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              Featured
            </h2>
          </div>
          <span className="hidden text-7xl font-bold uppercase tracking-tighter text-secondary sm:block font-display">
            {String(featuredProducts.length).padStart(2, "0")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
