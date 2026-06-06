import { loadStripe, type Stripe } from "@stripe/stripe-js";

// The publishable key now comes from the headless Stripe gateway's
// `/intent` response (it can vary between live/test mode server-side),
// so we lazily memoize loadStripe per key instead of using a static singleton.
let cachedKey: string | null = null;
let cachedPromise: Promise<Stripe | null> | null = null;

export function getStripe(publishableKey: string): Promise<Stripe | null> {
  if (!cachedPromise || cachedKey !== publishableKey) {
    cachedKey = publishableKey;
    cachedPromise = loadStripe(publishableKey);
  }
  return cachedPromise;
}
