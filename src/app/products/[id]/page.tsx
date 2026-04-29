import {
  ArrowLeft,
  Check,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchProduct } from "@/lib/storeApi/products";
import { AddToCart } from "./_components/AddToCart";
import { AddToCartSkeleton } from "./_components/AddToCartSkeleton";

type cartStateType = "idle" | "loading" | "added";

const cartState: cartStateType = "idle" as cartStateType;

const quantity = 1;

const ProductDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  "use cache";
  const { id } = await params;

  const product = await fetchProduct(id);

  if (!product) {
    return notFound();
  }

  return (
    <div className="container mx-auto pt-24 pb-20">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent font-display uppercase tracking-wider"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="grid gap-12 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
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
