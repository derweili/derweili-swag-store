import { cookies } from "next/headers";
import { createNewCart } from "../storeApi/fetchCart";

export async function getCartToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("cart_id")?.value;
}

export async function setCartToken(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set("cart_id", cartId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days — persists across refreshes
  });
}

export async function clearCartToken() {
  const cookieStore = await cookies();
  cookieStore.delete("cart_id");
}

export async function getOrCreateCartToken(): Promise<string> {
  const cartId = await getCartToken();

  if (cartId) {
    return cartId;
  }

  const res = await createNewCart();
  await setCartToken(res.token);
  return res.token;
}
