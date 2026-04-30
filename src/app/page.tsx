import type { Metadata } from "next";
import { Suspense } from "react";
import type { WebSite, WithContext } from "schema-dts";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedProductsSkeleton from "@/components/FeaturedProductsSkeleton";
import HeroSection from "@/components/HeroSection";
import HomePromotionBanner from "@/components/HomePromotionBanner";
import PromotionBannerSkeleton from "@/components/PromotionBannerSkeleton";
import { JsonLd } from "@/lib/seo/components/JsonLd";
import { getSiteUrl } from "@/lib/seo/jsonld";
import { fetchStoreConfigForSeo } from "@/lib/seo/storeConfig";

export async function generateMetadata(): Promise<Metadata> {
  const config = await fetchStoreConfigForSeo();

  return {
    title: { absolute: config.seo.defaultTitle },
    description: config.seo.defaultDescription,
    openGraph: {
      type: "website",
      title: config.seo.defaultTitle,
      description: config.seo.defaultDescription,
    },
    twitter: {
      title: config.seo.defaultTitle,
      description: config.seo.defaultDescription,
    },
  };
}

const Home = async () => {
  const config = await fetchStoreConfigForSeo();
  const siteUrl = getSiteUrl();

  const jsonLd: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.seo.defaultTitle,
    description: config.seo.defaultDescription,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      // @ts-expect-error — query-input is required by Google but not in schema-dts
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
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
