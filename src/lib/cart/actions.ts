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
}

export async function addToCart(
  productId: string,
  quantity: number,
): Promise<Cart> {
  const cartToken = await getOrCreateCartToken();
  const cart = await addItemToCart(cartToken, productId, quantity);
  revalidateCartSurfaces();
  return cart;
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
