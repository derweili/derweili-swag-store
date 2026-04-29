"use client";
import { Check, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { startTransition, useOptimistic, useState } from "react";
import { QuantitySelect } from "@/components/QuantitySelect";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart/actions";
import type { Stock } from "@/lib/storeApi/schema/stock";
import { cn } from "@/lib/utils";

export function AddToCartClient({
  productId,
  stock,
}: {
  productId: string;
  stock: Stock;
}) {
  const { inStock, lowStock, stock: maxQuantity } = stock;

  const [pending, setPending] = useOptimistic(false);

  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  async function handleClick() {
    console.log("handleClick", productId);
    startTransition(async () => {
      console.log("Adding to cart", productId);
      setPending(true);
      setIsAdded(true);
      await addToCart(productId, quantity);
    });
  }

  return (
    <div className="mt-8">
      {!inStock ? (
        <span className="text-sm font-semibold uppercase tracking-wider text-destructive">
          Out of Stock
        </span>
      ) : lowStock ? (
        <span className="text-sm font-semibold uppercase tracking-wider text-neon-pink animate-pulse-neon">
          Only {maxQuantity} left
        </span>
      ) : (
        <span className="text-sm font-semibold uppercase tracking-wider text-accent">
          In Stock — {maxQuantity} available
        </span>
      )}

      {inStock && (
        <QuantitySelect
          quantity={quantity}
          onQuantityChange={setQuantity}
          maxQuantity={maxQuantity}
        />
      )}

      <Button
        variant={isAdded ? "default" : "neon"}
        className={`mt-8 w-full transition-all ${isAdded ? "bg-green-600 hover:bg-green-600 text-white" : ""}`}
        size="xl"
        disabled={!inStock || pending}
        onClick={handleClick}
      >
        {pending && (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Adding...
          </>
        )}
        {!pending && !isAdded && (
          <>
            <ShoppingBag className="mr-2 h-5 w-5" />
            Add to Cart
          </>
        )}
        {!pending && isAdded && (
          <>
            <Check className="mr-2 h-5 w-5" />
            Added to Cart
          </>
        )}
      </Button>
      <Link
        href="/cart"
        className={cn(
          "mt-3 flex items-center justify-center text-sm text-accent underline underline-offset-4 transition-opacity animate-in fade-in",
          {
            invisible: !isAdded,
          },
        )}
        aria-hidden={!isAdded}
      >
        View Cart →
      </Link>
    </div>
  );
}
