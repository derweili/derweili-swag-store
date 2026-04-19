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
import { Button } from "@/components/ui/button";
import { fetchProduct } from "@/lib/storeApi/fetchProduct";

type cartStateType = "idle" | "loading" | "added";

const cartState: cartStateType = "idle" as cartStateType;

const quantity = 1;

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

  const isOutOfStock = false;
  const isLowStock = false;

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
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <span className="font-display text-lg font-bold uppercase tracking-widest text-muted-foreground">
                Sold Out
              </span>
            </div>
          )}
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

          {/* Stock */}
          <div className="mt-8">
            {isOutOfStock ? (
              <span className="text-sm font-semibold uppercase tracking-wider text-destructive">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-sm font-semibold uppercase tracking-wider text-neon-pink animate-pulse-neon">
                Only 23 left
              </span>
            ) : (
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                In Stock — 23 available
              </span>
            )}
          </div>

          {/* Quantity */}
          {!isOutOfStock && (
            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Qty
              </span>
              <div className="flex items-center border border-border">
                <button
                  type="button"
                  // onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-11 w-14 items-center justify-center border-x border-border font-display font-semibold">
                  {quantity}
                </span>
                <button
                  type="button"
                  // onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <Button
            variant={cartState === "added" ? "default" : "neon"}
            size="xl"
            className={`mt-8 w-full transition-all ${cartState === "added" ? "bg-green-600 hover:bg-green-600 text-white" : ""}`}
            disabled={isOutOfStock || cartState === "loading"}
            // onClick={handleAddToCart}
          >
            {cartState === "loading" && (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Adding...
              </>
            )}
            {cartState === "idle" && (
              <>
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </>
            )}
            {cartState === "added" && (
              <>
                <Check className="mr-2 h-5 w-5" />
                Added to Cart
              </>
            )}
          </Button>

          {cartState === "added" && (
            <Link
              href="/search"
              className="mt-3 flex items-center justify-center text-sm text-accent underline underline-offset-4 transition-opacity animate-in fade-in"
            >
              View Cart →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
