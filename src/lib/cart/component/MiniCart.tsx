import { CartIcon } from "@/components/CartIcon";
import { fetchCart } from "@/lib/storeApi/fetchCart";
import { getCartToken } from "../cartToken";

export const MiniCart = async () => {
  const cartToken = await getCartToken();
  if (!cartToken) {
    return <CartIcon numberOfItems={0} />;
  }

  const cart = await fetchCart(cartToken);

  const numberOfItems = cart.items.length;

  return <CartIcon numberOfItems={numberOfItems} />;
};
