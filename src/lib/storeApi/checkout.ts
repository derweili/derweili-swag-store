import { fetchApi } from "./fetchApi";
import {
  CheckoutOrderSchema,
  type BillingAddress,
  type CheckoutOrder,
  type ShippingAddress,
} from "./schema/checkout";

// Payment method must be enabled in WooCommerce Admin → Payments.
// "cheque" = Check payments (built-in, good for testing).
// Swap this once a real gateway is integrated.
const PAYMENT_METHOD = "cheque";

export async function submitCheckout(
  cartToken: string,
  billingAddress: BillingAddress,
  shippingAddress: ShippingAddress,
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
        payment_method: PAYMENT_METHOD,
        payment_data: [],
      }),
    },
    CheckoutOrderSchema,
  );
  return order;
}
