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

export const fetchProduct = async (id: string) => {
  const product = await fetchApi(
    `/products/${id}`,
    {
      cache: "force-cache",
    },
    ProductSchema,
  );

  return product;
};
