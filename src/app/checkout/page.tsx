import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCartToken } from "@/lib/cart/cartToken";
import { fetchCart } from "@/lib/storeApi/fetchCart";
import { CheckoutForm } from "./_components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

async function CheckoutBody() {
  const token = await getCartToken();
  if (!token) redirect("/cart");

  const { cart } = await fetchCart(token);
  if (cart.items.length === 0) redirect("/cart");

  return <CheckoutForm cart={cart} />;
}

export default function Checkout() {
  return (
    <div className="container mx-auto pt-24 pb-20 max-w-7xl">
      <Link
        href="/cart"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent font-display uppercase tracking-wider"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Link>

      <h1 className="font-display text-5xl font-bold uppercase tracking-tight sm:text-6xl mb-10">
        Checkout
      </h1>

      <Suspense fallback={<div className="animate-pulse h-96 bg-secondary/20 rounded" />}>
        <CheckoutBody />
      </Suspense>
    </div>
  );
}
