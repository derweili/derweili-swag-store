import { z } from "zod/mini";
import { fetchApi } from "./fetchApi";
import { ProductSchema } from "./schema/product";

export const fetchProducts = async () => {
  const products = await fetchApi(
    "/products",
    {
      cache: "force-cache",
    },
    z.array(ProductSchema),
  );
  return products;
};
