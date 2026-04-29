import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="font-display text-lg uppercase tracking-widest text-muted-foreground">
        Your cart is empty
      </p>
      <Link href="/search" className="mt-6">
        <Button variant="neon-outline">Continue Shopping</Button>
      </Link>
    </div>
  );
};
