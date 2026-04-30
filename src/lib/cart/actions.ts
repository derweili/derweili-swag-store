"use server";

import { revalidatePath } from "next/cache";
import {
  addItemToCart,
  deleteCartItem,
  updateCartItem as updateCartItemApi,
} from "../storeApi/fetchCart";
import type { Cart } from "../storeApi/schema/cart";
import { getOrCreateCartToken } from "./cartToken";

function revalidateCartSurfaces() {
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

export async function addToCart(productId: string, quantity: number) {
  const cartToken = await getOrCreateCartToken();
  await addItemToCart(cartToken, productId, quantity);
  revalidateCartSurfaces();
}

export async function updateCartItem(
  itemId: string,
  quantity: number,
): Promise<Cart> {
  const cartId = await getOrCreateCartToken();
  const cart = await updateCartItemApi(cartId, itemId, quantity);
  revalidateCartSurfaces();
  return cart;
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  const cartId = await getOrCreateCartToken();
  const cart = await deleteCartItem(cartId, itemId);
  revalidateCartSurfaces();
  return cart;
}
