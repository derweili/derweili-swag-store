import { cookies } from "next/headers";
import type { BillingAddress } from "../storeApi/schema/checkout";

// Persists the in-flight checkout across a redirect to the customer's bank
// (iDEAL, Bancontact, …). The /checkout/complete page reads it back to
// finalize the order once the customer returns to the store.
export type PendingCheckout = {
  orderId: number;
  orderKey: string;
  publishableKey: string;
  billingAddress: BillingAddress;
};

const COOKIE_NAME = "pending_checkout";

export async function setPendingCheckout(data: PendingCheckout): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, JSON.stringify(data), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 30, // 30 minutes — long enough to complete a bank redirect
  });
}

export async function getPendingCheckout(): Promise<PendingCheckout | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingCheckout;
  } catch {
    return null;
  }
}

export async function clearPendingCheckout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
