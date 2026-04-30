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
  const products = await fetchProducts({});
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      type: "website",
      title: product.name,
      description: product.description,
      images: product.images[0]
        ? [{ url: product.images[0], alt: product.name }]
        : [],
    },
    twitter: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

const ProductDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const product = await fetchProduct(id);

  if (!product) {
    return notFound();
  }

  const jsonLd: WithContext<SchemaProduct> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    category: product.category,
    offers: {
      "@type": "Offer",
      price: (product.price / 100).toFixed(2),
      priceCurrency: product.currency,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="container mx-auto pt-24 pb-20">
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
          <Image
            width={652}
            height={869}
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-3">
            {product.category}
          </p>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-bold text-accent font-display">
            ${(product.price / 100).toFixed(2)}
          </p>

          <p className="mt-6 text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <Suspense fallback={<AddToCartSkeleton />}>
            <AddToCart productId={product.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
