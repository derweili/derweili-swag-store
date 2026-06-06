import { fetchApi } from "./fetchApi";
import {
  type BillingAddress,
  type CheckoutDraft,
  CheckoutDraftSchema,
  type CheckoutOrder,
  CheckoutOrderSchema,
  type PaymentDataEntry,
  type ShippingAddress,
} from "./schema/checkout";

/**
 * Creates (or retrieves) the draft order for the current cart.
 * WooCommerce returns order_id/order_key, required to create a Stripe PaymentIntent.
 */
export async function getCheckoutDraft(
  cartToken: string,
): Promise<CheckoutDraft> {
  const { data: draft } = await fetchApi(
    "/checkout",
    { headers: { "Cart-Token": cartToken } },
    CheckoutDraftSchema,
  );
  return draft;
}

export async function submitCheckout(
  cartToken: string,
  billingAddress: BillingAddress,
  shippingAddress: ShippingAddress,
  paymentMethod: string,
  paymentData: PaymentDataEntry[],
): Promise<CheckoutOrder> {
  const { data: order } = await fetchApi(
    "/checkout",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cart-Token": cartToken,
      },
      body: JSON.stringify({
        billing_address: billingAddress,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        payment_data: paymentData,
      }),
    },
    CheckoutOrderSchema,
  );
  return order;
}
