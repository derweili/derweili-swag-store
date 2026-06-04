import { fetchPromotionForHome } from "@/lib/storeApi/promotions";
import PromotionBannerClient from "./PromotionBannerClient";

const HomePromotionBanner = async () => {
  const promotion = await fetchPromotionForHome();
  if (!promotion) return null;
  return <PromotionBannerClient {...promotion} />;
};

export default HomePromotionBanner;
