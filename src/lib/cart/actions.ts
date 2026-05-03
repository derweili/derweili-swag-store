"use server";

import { revalidatePath } from "next/cache";
import { FetchApiHttpError } from "../storeApi/fetchApi";
import {
  addItemToCart,
  deleteCartItem,
  updateCartItem as updateCartItemApi,
} from "../storeApi/fetchCart";
import type { Cart } from "../storeApi/schema/cart";
import { clearCartToken, getOrCreateCartToken } from "./cartToken";

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
