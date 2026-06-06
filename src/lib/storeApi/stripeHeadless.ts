import { serverEnv } from "@/lib/env/serverEnv";
import { FetchApiHttpError } from "./fetchApi";
import { type PaymentIntent, PaymentIntentSchema } from "./schema/checkout";

// The headless Stripe gateway exposes its endpoints under a separate
// namespace (`/wc-stripe-headless/v1`) alongside the Store API
// (`/wc/store/v1`) on the same WordPress instance.
const headlessBaseUrl = serverEnv.SWAG_STORE_WOOCOMMERCE_API_URL.replace(
  /\/wc\/store\/v\d+\/?$/,
  "/wc-stripe-headless/v1",
);

/**
 * Creates (or retrieves) the Stripe PaymentIntent for a draft order.
 * Safe to call multiple times — returns the same PaymentIntent until the
 * order amount or currency changes.
 */
export async function createPaymentIntent(
  orderId: number,
  orderKey: string,
): Promise<PaymentIntent> {
  const url = `${headlessBaseUrl.replace(/\/$/, "")}/intent`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, order_key: orderKey }),
    });
  } catch (err) {
    console.error(`[createPaymentIntent] Network error fetching ${url}:`, err);
    throw err;
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "(unreadable)");
    console.error(
      `[createPaymentIntent] HTTP ${res.status} ${res.statusText} — ${url}\n${body}`,
    );
    throw new FetchApiHttpError(res.status, res.statusText);
  }

  const json = (await res.json()) as unknown;
  return PaymentIntentSchema.parse(json);
}
