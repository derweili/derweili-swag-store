import { fetchStock } from "@/lib/storeApi/stock";
import { AddToCartClient } from "./AddToCartClient";

export const AddToCart = async ({ productId }: { productId: string }) => {
  const stock = await fetchStock(productId);

  return <AddToCartClient productId={productId} stock={stock} />;
};
