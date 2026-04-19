import FeaturedProducts from "@/components/FeaturedProducts";
import HeroSection from "@/components/HeroSection";
import PromoBanner from "@/components/PromotionBanner";

const Home = async () => {
  return (
    <>
      <HeroSection />
      <PromoBanner
        title="Promotion"
        description="Promotion description"
        promoCode="PROMO123"
      />
      <FeaturedProducts />
    </>
  );
};

export default Home;
