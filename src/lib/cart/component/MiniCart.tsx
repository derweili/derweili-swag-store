import { CartIcon } from "@/components/CartIcon";
import { fetchCart } from "@/lib/storeApi/fetchCart";
import { getCartToken } from "../cartToken";

export const MiniCart = async () => {
  const cartToken = await getCartToken();
  if (!cartToken) {
    return <CartIcon numberOfItems={0} />;
  }

  let numberOfItems = 0;
  try {
    const { cart } = await fetchCart(cartToken);
    numberOfItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  } catch {
    // Stale or invalid token — treat as empty cart
  }

  return <CartIcon numberOfItems={numberOfItems} />;
};
