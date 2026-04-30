import { fetchPromotionForHome } from "@/lib/storeApi/promotions";
import PromotionBannerClient from "./PromotionBannerClient";

const HomePromotionBanner = async () => {
  try {
    const promotion = await fetchPromotionForHome();
    return <PromotionBannerClient {...promotion} />;
  } catch {
    return null;
  }
};

export default HomePromotionBanner;
