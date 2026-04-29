import { fetchApi } from "./fetchApi";
import { CartWithProductsSchema } from "./schema/cart";

export const fetchCart = async (token: string) => {
  const cart = await fetchApi(
    "/cart",
    {
      cache: "no-store",
      headers: {
        "x-cart-token": token,
      },
    },
    CartWithProductsSchema,
  );
  return cart;
};

export const addItemToCart = async (
  token: string,
  productId: string,
  quantity: number,
) => {
  const cart = await fetchApi(
    "/cart",
    {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
      headers: {
        "x-cart-token": token,
        "Content-Type": "application/json",
      },
    },
    CartWithProductsSchema,
  );
  return cart;
};

export const createNewCart = async () => {
  const cart = await fetchApi(
    "/cart/create",
    {
      method: "POST",
    },
    CartWithProductsSchema,
  );
  return cart;
};

export const updateCartItem = async (
  token: string,
  itemId: string,
  quantity: number,
) => {
  const cart = await fetchApi(
    `/cart/${itemId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
      headers: {
        "x-cart-token": token,
        "Content-Type": "application/json",
      },
    },
    CartWithProductsSchema,
  );
  return cart;
};

export const deleteCartItem = async (token: string, itemId: string) => {
  const cart = await fetchApi(
    `/cart/${itemId}`,
    {
      method: "DELETE",
      headers: {
        "x-cart-token": token,
      },
    },
    CartWithProductsSchema,
  );
  return cart;
};
