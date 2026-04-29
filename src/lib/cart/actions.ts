// actions/cart.ts
"use server";
import { revalidatePath } from "next/cache";
import {
  addItemToCart,
  deleteCartItem,
  updateCartItem as updateCartItemApi,
} from "../storeApi/fetchCart";
import { getOrCreateCartToken } from "./cartToken";

export async function addToCart(productId: string, quantity: number) {
  console.log("addToCart", productId, quantity);
  const cartToken = await getOrCreateCartToken();
  console.log("addToCart cartToken", cartToken);
  await addItemToCart(cartToken, productId, quantity);
  revalidatePath("/cart");
}

export async function updateCartItem(itemId: string, quantity: number) {
  const cartId = await getOrCreateCartToken();
  await updateCartItemApi(cartId, itemId, quantity);
  revalidatePath("/cart");
}

export async function removeCartItem(itemId: string) {
  const cartId = await getOrCreateCartToken();
  await deleteCartItem(cartId, itemId);
  revalidatePath("/cart");
}
