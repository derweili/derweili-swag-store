import { cookies } from "next/headers";
import { createNewCart } from "../storeApi/fetchCart";

export async function getCartToken(): Promise<string | undefined> {
  console.log("getCartToken");
  const cookieStore = await cookies();
  console.log("getCartToken cookieStore", cookieStore.get("cart_id"));
  return cookieStore.get("cart_id")?.value;
}

export async function setCartToken(cartId: string) {
  console.log("setCartToken", cartId);
  const cookieStore = await cookies();
  cookieStore.set("cart_id", cartId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days — persists across refreshes
  });
}

export async function getOrCreateCartToken(): Promise<string> {
  const cartId = await getCartToken();

  if (cartId) {
    console.log("getOrCreateCartToken cartId", cartId);
    return cartId;
  }

  console.log("getOrCreateCartToken creating new cart");

  const res = await createNewCart();
  await setCartToken(res.token);
  return res.token;
}
