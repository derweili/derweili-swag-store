import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Product as SchemaProduct, WithContext } from "schema-dts";
import { JsonLd } from "@/lib/seo/components/JsonLd";
import { fetchProduct, fetchProducts } from "@/lib/storeApi/products";
import { AddToCart } from "./_components/AddToCart";
import { AddToCartSkeleton } from "./_components/AddToCartSkeleton";

export async function generateStaticParams() {
  const products = await fetchProducts({ limit: 50 });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) return {};

  const firstImage = product.images[0];

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      type: "website",
      title: product.name,
      description: product.description,
      images: firstImage
        ? [{ url: firstImage.src, alt: firstImage.alt || product.name }]
        : [],
    },
    twitter: {
      title: product.name,
      description: product.description,
      images: firstImage ? [firstImage.src] : [],
    },
  };
}

const ProductDetail = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const product = await fetchProduct(slug);

  if (!product) {
    return notFound();
  }

  const price =
    parseInt(product.prices.price, 10) /
    Math.pow(10, product.prices.currency_minor_unit);

  const firstImage = product.images[0];
  const category = product.categories[0]?.name ?? "";

  const jsonLd: WithContext<SchemaProduct> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img.src),
    category,
    offers: {
      "@type": "Offer",
      price: price.toFixed(product.prices.currency_minor_unit),
      priceCurrency: product.prices.currency_code,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="container mx-auto pt-8 md:pt-24 pb-20">
      <JsonLd data={jsonLd} />
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent font-display uppercase tracking-wider"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="grid gap-12 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-3/4 overflow-hidden bg-secondary">
          {firstImage && (
            <Image
              width={652}
              height={869}
              src={firstImage.src}
              alt={firstImage.alt || product.name}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1530px) 50vw, 744px"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center px-2 md:px-0">
          {category && (
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-3">
              {category}
            </p>
          )}
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-bold text-accent font-display">
            {product.prices.currency_prefix}
            {price.toFixed(product.prices.currency_minor_unit)}
          </p>

          <p className="mt-6 text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <Suspense fallback={<AddToCartSkeleton />}>
            <AddToCart productId={String(product.id)} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
