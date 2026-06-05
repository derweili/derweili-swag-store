import { z } from "zod/mini";
import { fetchApi } from "./fetchApi";
import type { Stock } from "./schema/stock";

const ProductStockSchema = z.object({
  id: z.int(),
  is_in_stock: z.boolean(),
  low_stock_remaining: z.nullable(z.int()),
  add_to_cart: z.object({
    maximum: z.int(),
  }),
});

/** Fetch live stock data for a product by its numeric WooCommerce ID (as string). */
export const fetchStock = async (productId: string): Promise<Stock> => {
  const { data: product } = await fetchApi(
    `/products/${productId}`,
    undefined,
    ProductStockSchema,
  );

  return {
    productId,
    inStock: product.is_in_stock,
    lowStock: product.low_stock_remaining !== null,
    stock: product.low_stock_remaining ?? product.add_to_cart.maximum,
  };
};
