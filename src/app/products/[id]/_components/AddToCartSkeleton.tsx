"use client";
import { Check } from "lucide-react";
import Link from "next/link";
import { QuantitySelect } from "@/components/QuantitySelect";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const AddToCartSkeleton = () => (
  <div className="mt-8">
    <span className="text-sm font-semibold uppercase tracking-wider text-destructive">
      &nbsp;
    </span>

    <QuantitySelect quantity={1} maxQuantity={1} />

    <Button
      variant="neon"
      className="mt-8 w-full transition-all"
      size="xl"
      disabled={true}
    >
      <Check className="mr-2 h-5 w-5" />
      Added to Cart
    </Button>
    <Link
      href="/cart"
      className={cn(
        "mt-3 flex items-center justify-center text-sm text-accent underline underline-offset-4 transition-opacity animate-in fade-in",
        "invisible",
      )}
      aria-hidden={true}
    >
      View Cart →
    </Link>
  </div>
);
