import { Suspense } from "react";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedProductsSkeleton from "@/components/FeaturedProductsSkeleton";
import HeroSection from "@/components/HeroSection";
import HomePromotionBanner from "@/components/HomePromotionBanner";
import PromotionBannerSkeleton from "@/components/PromotionBannerSkeleton";

const Home = () => {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<PromotionBannerSkeleton />}>
        <HomePromotionBanner />
      </Suspense>
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
    </>
  );
};

export default Home;
