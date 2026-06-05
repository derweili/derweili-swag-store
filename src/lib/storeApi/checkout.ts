import { fetchApi } from "./fetchApi";
import {
  CheckoutOrderSchema,
  type BillingAddress,
  type CheckoutOrder,
  type PaymentDataEntry,
  type ShippingAddress,
} from "./schema/checkout";

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
