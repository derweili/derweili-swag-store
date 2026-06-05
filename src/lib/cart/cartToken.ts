import { cookies } from "next/headers";
import { fetchCart } from "../storeApi/fetchCart";

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
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearCartToken() {
  const cookieStore = await cookies();
  cookieStore.delete("cart_id");
}

export async function getOrCreateCartToken(): Promise<string> {
  const cartId = await getCartToken();
  if (cartId) return cartId;

  // GET /cart without a token: WooCommerce creates a new cart and returns Cart-Token in headers
  const { cartToken } = await fetchCart(undefined);
  if (!cartToken) throw new Error("WooCommerce did not return a Cart-Token");
  await setCartToken(cartToken);
  return cartToken;
}
