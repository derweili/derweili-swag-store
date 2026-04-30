import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export const CartIcon = ({ numberOfItems }: { numberOfItems: number }) => {
  return (
    <Link
      href="/cart"
      className="relative text-muted-foreground transition-colors hover:text-accent"
      aria-label={`Cart${numberOfItems > 0 ? `, ${numberOfItems} items` : ""}`}
    >
      <ShoppingBag className="h-5 w-5" />
      {numberOfItems > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center bg-accent text-[10px] font-bold text-accent-foreground">
          {numberOfItems}
        </span>
      )}
    </Link>
  );
};
