import { Product } from "@/lib/storeApi/schema/product";
import Image from "next/image";
import Link from "next/link";


type ProductCardProps = {
  product: Product;
  imagePriority?: boolean;
};

const ProductCard = ({ product, imagePriority = false }: ProductCardProps) => {
  // const isOutOfStock = product.stock === 0;

  if(!product ) {
    return null;
  }

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <Image
          src={product.images[0]}
          alt={product.name}
					width={320}
					height={426}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          priority={imagePriority}
        />
        {/* {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <span className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Sold Out
            </span>
          </div>
        )} */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left" />
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider">
          {product.name}
        </h3>
        <p className="text-sm text-accent font-semibold">
          ${(product.price / 100).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
