import { Suspense } from "react";
import CartContents from "@/app/cart/_components/CartContents";
import { CartPageSkeleton } from "@/app/cart/_components/CartPageSkeleton";
import { EmptyCart } from "@/app/cart/_components/EmptyCart";
import { getCartToken } from "@/lib/cart/cartToken";
import { fetchCart } from "@/lib/storeApi/fetchCart";
import { CartDrawer } from "./_components/CartDrawer";

async function CartBody() {
  const token = await getCartToken();

  if (!token) {
    return <EmptyCart />;
  }

  const cart = await fetchCart(token);
  return <CartContents variant="drawer" cart={cart} />;
}

export default function InterceptedCartPage() {
  return (
    <CartDrawer>
      <Suspense fallback={<CartPageSkeleton />}>
        <CartBody />
      </Suspense>
    </CartDrawer>
  );
}
