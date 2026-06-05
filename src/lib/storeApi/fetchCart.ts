import { fetchApi } from "./fetchApi";
import type { Cart } from "./schema/cart";
import { CartWithProductsSchema } from "./schema/cart";

function cartHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Cart-Token"] = token;
  return headers;
}

/**
 * Fetch the current cart. If no token is provided, WooCommerce creates a new cart
 * and returns a Cart-Token in the response headers.
 */
export const fetchCart = async (
  token?: string,
): Promise<{ cart: Cart; cartToken: string | undefined }> => {
  const { data: cart, metadata } = await fetchApi(
    "/cart",
    token ? { headers: { "Cart-Token": token } } : undefined,
    CartWithProductsSchema,
  );
  return { cart, cartToken: metadata["cart-token"] };
};

export const addItemToCart = async (
  token: string,
  productId: string,
  quantity: number,
): Promise<Cart> => {
  const { data: cart } = await fetchApi(
    "/cart/add-item",
    {
      method: "POST",
      body: JSON.stringify({ id: parseInt(productId, 10), quantity }),
      headers: cartHeaders(token),
    },
    CartWithProductsSchema,
  );
  return cart;
};

export const updateCartItem = async (
  token: string,
  itemKey: string,
  quantity: number,
): Promise<Cart> => {
  const { data: cart } = await fetchApi(
    "/cart/update-item",
    {
      method: "POST",
      body: JSON.stringify({ key: itemKey, quantity }),
      headers: cartHeaders(token),
    },
    CartWithProductsSchema,
  );
  return cart;
};

export const updateCartCustomer = async (
  token: string,
  shippingAddress: { postcode: string; country: string; state: string },
): Promise<Cart> => {
  const { data: cart } = await fetchApi(
    "/cart/update-customer",
    {
      method: "POST",
      body: JSON.stringify({ shipping_address: shippingAddress }),
      headers: cartHeaders(token),
    },
    CartWithProductsSchema,
  );
  return cart;
};

export const selectCartShippingRate = async (
  token: string,
  packageId: string | number,
  rateId: string,
): Promise<Cart> => {
  const { data: cart } = await fetchApi(
    "/cart/select-shipping-rate",
    {
      method: "POST",
      body: JSON.stringify({ package_id: packageId, rate_id: rateId }),
      headers: cartHeaders(token),
    },
    CartWithProductsSchema,
  );
  return cart;
};

export const deleteCartItem = async (
  token: string,
  itemKey: string,
): Promise<Cart> => {
  const { data: cart } = await fetchApi(
    "/cart/remove-item",
    {
      method: "POST",
      body: JSON.stringify({ key: itemKey }),
      headers: cartHeaders(token),
    },
    CartWithProductsSchema,
  );
  return cart;
};
