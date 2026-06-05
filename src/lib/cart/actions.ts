"use server";

import { revalidatePath } from "next/cache";
import { submitCheckout } from "../storeApi/checkout";
import { FetchApiHttpError } from "../storeApi/fetchApi";
import {
  addItemToCart,
  deleteCartItem,
  updateCartItem as updateCartItemApi,
} from "../storeApi/fetchCart";
import type { Cart } from "../storeApi/schema/cart";
import type {
  BillingAddress,
  CheckoutOrder,
  ShippingAddress,
} from "../storeApi/schema/checkout";
import { clearCartToken, getCartToken, getOrCreateCartToken } from "./cartToken";

function revalidateCartSurfaces() {
  revalidatePath("/cart");
}

function isCartNotFound(err: unknown): boolean {
  return err instanceof FetchApiHttpError && err.status === 404;
}

export async function addToCart(
  productId: string,
  quantity: number,
): Promise<Cart> {
  const cartToken = await getOrCreateCartToken();
  try {
    const cart = await addItemToCart(cartToken, productId, quantity);
    revalidateCartSurfaces();
    return cart;
  } catch (err) {
    if (isCartNotFound(err)) {
      // Expired cart — clear stale token and retry with a fresh cart
      await clearCartToken();
      const newToken = await getOrCreateCartToken();
      const cart = await addItemToCart(newToken, productId, quantity);
      revalidateCartSurfaces();
      return cart;
    }
    throw err;
  }
}

export async function updateCartItem(
  itemId: string,
  quantity: number,
): Promise<Cart> {
  const cartId = await getOrCreateCartToken();
  try {
    const cart = await updateCartItemApi(cartId, itemId, quantity);
    revalidateCartSurfaces();
    return cart;
  } catch (err) {
    if (isCartNotFound(err)) {
      await clearCartToken();
      revalidateCartSurfaces();
    }
    throw err;
  }
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  const cartId = await getOrCreateCartToken();
  try {
    const cart = await deleteCartItem(cartId, itemId);
    revalidateCartSurfaces();
    return cart;
  } catch (err) {
    if (isCartNotFound(err)) {
      await clearCartToken();
      revalidateCartSurfaces();
    }
    throw err;
  }
}

export async function placeOrder(
  billingAddress: BillingAddress,
): Promise<CheckoutOrder> {
  const cartToken = await getCartToken();
  if (!cartToken) throw new Error("No active cart found");

  const shippingAddress: ShippingAddress = {
    first_name: billingAddress.first_name,
    last_name: billingAddress.last_name,
    company: billingAddress.company,
    address_1: billingAddress.address_1,
    address_2: billingAddress.address_2,
    city: billingAddress.city,
    state: billingAddress.state,
    postcode: billingAddress.postcode,
    country: billingAddress.country,
  };

  const order = await submitCheckout(cartToken, billingAddress, shippingAddress);

  await clearCartToken();
  revalidatePath("/cart");

  return order;
}
