import { cacheLife, cacheTag } from "next/cache";
import { fetchApi } from "./fetchApi";
import type { Promotion } from "./schema/promotion";
import { PromotionSchema } from "./schema/promotion";

/** Uncached API read; prefer `fetchPromotionForHome` on the homepage. */
export async function fetchPromotion(): Promise<Promotion> {
  return fetchApi(`/promotions`, undefined, PromotionSchema);
}

/**
 * Cached promotion payload for the homepage marquee.
 * Serves stale content while revalidating in the background (stale-while-revalidate).
 */
export async function fetchPromotionForHome(): Promise<Promotion> {
  "use cache";
  cacheLife({
    stale: 300, // 5m — ok to show slightly stale copy while refreshing
    revalidate: 900, // 15m — background refresh cadence
    expire: 86_400,
  });
  cacheTag("store-promotions");
  return fetchPromotion();
}
