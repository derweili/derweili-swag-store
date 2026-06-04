import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod/mini";
import { fetchApi } from "./fetchApi";
import type { Product } from "./schema/product";
import { ProductSchema } from "./schema/product";

type FetchProductsParams = {
  query?: string;
  category?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
};

export const fetchProducts = async ({
  query,
  category,
  page,
  limit,
  featured,
}: FetchProductsParams = {}) => {
  const queryParams = new URLSearchParams();
  if (query) queryParams.set("search", query);
  if (category) queryParams.set("category", category);
  if (page != null) queryParams.set("page", page.toString());
  if (limit != null) queryParams.set("per_page", limit.toString());
  if (featured != null) queryParams.set("featured", featured.toString());

  const qs = queryParams.toString();
  const path = qs === "" ? "/products" : `/products?${qs}`;

  const { data: products } = await fetchApi(path, undefined, z.array(ProductSchema));
  return products;
};

export async function fetchFeaturedProductsForHome(): Promise<Product[]> {
  "use cache";
  cacheLife({
    stale: 300,
    revalidate: 900,
    expire: 86_400,
  });
  cacheTag("store-products", "store-featured-products");
  return fetchProducts({ featured: true, limit: 8 });
}

export async function fetchProductCategories(): Promise<string[]> {
  "use cache";
  cacheLife("store-catalog");
  cacheTag("store-products", "product-categories");
  const products = await fetchProducts({});
  return [...new Set(products.flatMap((p) => p.categories.map((c) => c.slug)))].sort();
}

export async function fetchProductsForSearchRoute(
  query: string | undefined,
  category: string | undefined,
): Promise<{ hasSearchQuery: boolean; products: Product[] }> {
  "use cache";
  cacheLife("store-catalog");
  cacheTag("store-products", "product-search");

  const apiCategory =
    category && category !== "All" && category.trim() !== ""
      ? category
      : undefined;
  const q = query?.trim() ?? "";
  const hasSearchQuery = q.length > 0;

  if (!hasSearchQuery) {
    const products = await fetchProducts({
      category: apiCategory,
      limit: 10,
    });
    return { hasSearchQuery, products };
  }

  const products = await fetchProducts({
    query: q,
    category: apiCategory,
    limit: 5,
  });
  return { hasSearchQuery, products };
}

/** Fetch a single product by slug. Returns null if not found. Cached per slug. */
export async function fetchProduct(slug: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("store-products", `product-${slug}`);
  const { data: products } = await fetchApi(
    `/products?slug=${encodeURIComponent(slug)}`,
    undefined,
    z.array(ProductSchema),
  );
  return products[0] ?? null;
}
