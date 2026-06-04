import type { Promotion } from "./schema/promotion";

/** WooCommerce does not have a promotions API; these functions always return null. */
export async function fetchPromotion(): Promise<Promotion | null> {
  return null;
}

export async function fetchPromotionForHome(): Promise<Promotion | null> {
  return null;
}
