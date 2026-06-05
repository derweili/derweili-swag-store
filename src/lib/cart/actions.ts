"use server";

import { revalidatePath } from "next/cache";
import { submitCheckout } from "../storeApi/checkout";
import { FetchApiHttpError } from "../storeApi/fetchApi";
import {
  addItemToCart,
  deleteCartItem,
  fetchCart,
  updateCartItem as updateCartItemApi,
} from "../storeApi/fetchCart";
import type { Cart } from "../storeApi/schema/cart";
import type { BillingAddress, PaymentDataEntry, PaymentResult, ShippingAddress } from "../storeApi/schema/checkout";
import { clearCartToken, getCartToken, getOrCreateCartToken } from "./cartToken";
import { setOrderConfirmation } from "./orderConfirmation";

function revalidateCartSurfaces() {
  revalidatePath("/cart");
}

function isCartNotFound(err: unknown): boolean {
  return err instanceof FetchApiHttpError && err.status === 404;
}

export async function addToCart(
  productId: string,
  quantity: number,
): Promise<Cart> {
  const cartToken = await getOrCreateCartToken();
  try {
    const cart = await addItemToCart(cartToken, productId, quantity);
    revalidateCartSurfaces();
    return cart;
  } catch (err) {
    if (isCartNotFound(err)) {
      // Expired cart — clear stale token and retry with a fresh cart
      await clearCartToken();
      const newToken = await getOrCreateCartToken();
      const cart = await addItemToCart(newToken, productId, quantity);
      revalidateCartSurfaces();
      return cart;
    }
    throw err;
  }
}

export async function updateCartItem(
  itemId: string,
  quantity: number,
): Promise<Cart> {
  const cartId = await getOrCreateCartToken();
  try {
    const cart = await updateCartItemApi(cartId, itemId, quantity);
    revalidateCartSurfaces();
    return cart;
  } catch (err) {
    if (isCartNotFound(err)) {
      await clearCartToken();
      revalidateCartSurfaces();
    }
    throw err;
  }
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  const cartId = await getOrCreateCartToken();
  try {
    const cart = await deleteCartItem(cartId, itemId);
    revalidateCartSurfaces();
    return cart;
  } catch (err) {
    if (isCartNotFound(err)) {
      await clearCartToken();
      revalidateCartSurfaces();
    }
    throw err;
  }
}

export async function placeOrder(
  billingAddress: BillingAddress,
  paymentMethod: string,
  paymentData: PaymentDataEntry[],
): Promise<{ orderKey: string; paymentResult: PaymentResult | null }> {
  const cartToken = await getCartToken();
  if (!cartToken) throw new Error("No active cart found");

  // Snapshot the cart before it's cleared — needed for the thank-you page
  const { cart } = await fetchCart(cartToken);

  const shippingAddress: ShippingAddress = {
    first_name: billingAddress.first_name,
    last_name: billingAddress.last_name,
    company: billingAddress.company,
    address_1: billingAddress.address_1,
    address_2: billingAddress.address_2,
    city: billingAddress.city,
    state: billingAddress.state,
    postcode: billingAddress.postcode,
    country: billingAddress.country,
  };

  const order = await submitCheckout(
    cartToken,
    billingAddress,
    shippingAddress,
    paymentMethod,
    paymentData,
  );

  await setOrderConfirmation({
    orderKey: order.order_key,
    orderNumber: order.order_number,
    billingAddress: {
      firstName: billingAddress.first_name,
      lastName: billingAddress.last_name,
      address1: billingAddress.address_1,
      address2: billingAddress.address_2,
      city: billingAddress.city,
      postcode: billingAddress.postcode,
      country: billingAddress.country,
      email: billingAddress.email,
    },
    items: cart.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      imageUrl: item.images[0]?.src ?? null,
      lineTotal: item.totals.line_total,
      currencyPrefix: item.totals.currency_prefix,
      currencyMinorUnit: item.totals.currency_minor_unit,
    })),
    totals: {
      subtotal: cart.totals.total_items,
      shipping: cart.totals.total_shipping,
      tax: cart.totals.total_tax,
      total: cart.totals.total_price,
      currencyPrefix: cart.totals.currency_prefix,
      currencyMinorUnit: cart.totals.currency_minor_unit,
      currencyCode: cart.totals.currency_code,
    },
  });

  await clearCartToken();
  revalidatePath("/cart");

  return { orderKey: order.order_key, paymentResult: order.payment_result };
}
