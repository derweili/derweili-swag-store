import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { clearCartToken, getCartToken } from "@/lib/cart/cartToken";
import { fetchCart } from "@/lib/storeApi/fetchCart";
import CartContents from "./_components/CartContents";
import { CartPageSkeleton } from "./_components/CartPageSkeleton";
import { EmptyCart } from "./_components/EmptyCart";

export const metadata: Metadata = {
  title: "Cart",
  robots: {
    index: false,
    follow: false,
  },
};

async function CartBody() {
  const token = await getCartToken();

  if (!token) {
    return <EmptyCart />;
  }

  try {
    const { cart } = await fetchCart(token);
    return <CartContents cart={cart} variant="page" />;
  } catch {
    await clearCartToken();
    return <EmptyCart />;
  }
}

export default function CartPage() {
  return (
    <div className="container mx-auto pt-8 md:pt-24 pb-20 max-w-4xl px-2">
      <Link
        href="/search"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent font-display uppercase tracking-wider"
      >
        <ArrowLeft className="h-4 w-4" /> Continue Shopping
      </Link>

      <h1 className="font-display text-5xl font-bold uppercase tracking-tight sm:text-6xl mb-2">
        Your Cart
      </h1>

      <Suspense fallback={<CartPageSkeleton />}>
        <CartBody />
      </Suspense>
    </div>
  );
}
