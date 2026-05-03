import { fetchPromotionForHome } from "@/lib/storeApi/promotions";
import PromotionBannerClient from "./PromotionBannerClient";

const HomePromotionBanner = async () => {
  try {
    const promotion = await fetchPromotionForHome();
    return <PromotionBannerClient {...promotion} />;
  } catch (err) {
    console.error("[HomePromotionBanner] Failed to load promotion:", err);
    return null;
  }
};

export default HomePromotionBanner;
