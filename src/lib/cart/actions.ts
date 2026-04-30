"use server";

import { revalidatePath } from "next/cache";
import {
  addItemToCart,
  deleteCartItem,
  updateCartItem as updateCartItemApi,
} from "../storeApi/fetchCart";
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

export async function updateCartItem(itemId: string, quantity: number) {
  const cartId = await getOrCreateCartToken();
  await updateCartItemApi(cartId, itemId, quantity);
  revalidateCartSurfaces();
}

export async function removeCartItem(itemId: string) {
  const cartId = await getOrCreateCartToken();
  await deleteCartItem(cartId, itemId);
  revalidateCartSurfaces();
}
