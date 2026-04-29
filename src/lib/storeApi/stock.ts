import { fetchApi } from "./fetchApi";
import { StockSchema } from "./schema/stock";

export const fetchStock = async (productId: string) => {
  const stock = await fetchApi(
    `/products/${productId}/stock`,
    {
      cache: "no-store",
    },
    StockSchema,
  );
  return stock;
};
