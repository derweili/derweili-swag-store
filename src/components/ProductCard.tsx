import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/storeApi/schema/product";

type ProductCardProps = {
  product: Product;
  imagePriority?: boolean;
};

const ProductCard = ({ product, imagePriority = false }: ProductCardProps) => {
  if (!product) {
    return null;
  }

  const firstImage = product.images[0];
  const price =
    parseInt(product.prices.price, 10) /
    Math.pow(10, product.prices.currency_minor_unit);

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        {firstImage && (
          <Image
            src={firstImage.src}
            alt={firstImage.alt || product.name}
            width={320}
            height={426}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            priority={imagePriority}
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left" />
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider">
          {product.name}
        </h3>
        <p className="text-sm text-accent font-semibold">
          {product.prices.currency_prefix}
          {price.toFixed(product.prices.currency_minor_unit)}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
