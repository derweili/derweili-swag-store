import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchCart } from "@/lib/storeApi/fetchCart";
import { getCartToken } from "@/lib/cart/cartToken";
import { CheckoutForm } from "./_components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

const Checkout = async () => {
  const token = await getCartToken();
  const { cart } = await fetchCart(token);

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="container pt-24 pb-20 max-w-7xl">
      <Link
        href="/cart"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent font-display uppercase tracking-wider"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Link>

      <h1 className="font-display text-5xl font-bold uppercase tracking-tight sm:text-6xl mb-10">
        Checkout
      </h1>

      <CheckoutForm cart={cart} />
    </div>
  );
};

export default Checkout;
