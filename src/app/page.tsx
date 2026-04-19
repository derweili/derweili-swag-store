import FeaturedProducts from "@/components/FeaturedProducts";
import HeroSection from "@/components/HeroSection";
import PromoBanner from "@/components/PromotionBanner";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PromoBanner title="Promotion" description="Promotion description" promoCode="PROMO123" />
      <FeaturedProducts />
    </>
    
  );
}
