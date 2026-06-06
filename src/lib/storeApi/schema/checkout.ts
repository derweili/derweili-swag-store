import { z } from "zod/mini";

const CheckoutAddressSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  company: z.string(),
  address_1: z.string(),
  address_2: z.string(),
  city: z.string(),
  state: z.string(),
  postcode: z.string(),
  country: z.string(),
  email: z.optional(z.string()),
  phone: z.optional(z.string()),
});

const PaymentDetailSchema = z.object({
  key: z.string(),
  value: z.unknown(),
});

const PaymentResultSchema = z.object({
  payment_status: z.string(),
  redirect_url: z.string(),
  payment_details: z.array(PaymentDetailSchema),
});

export const CheckoutDraftSchema = z.object({
  order_id: z.int(),
  order_key: z.string(),
  billing_address: CheckoutAddressSchema,
  shipping_address: CheckoutAddressSchema,
});

export type CheckoutDraft = z.infer<typeof CheckoutDraftSchema>;

export const PaymentIntentSchema = z.object({
  client_secret: z.string(),
  payment_intent_id: z.string(),
  publishable_key: z.string(),
  amount: z.int(),
  currency: z.string(),
});

export type PaymentIntent = z.infer<typeof PaymentIntentSchema>;

export const CheckoutOrderSchema = z.object({
  order_id: z.int(),
  order_number: z.string(),
  order_key: z.string(),
  status: z.string(),
  billing_address: CheckoutAddressSchema,
  shipping_address: CheckoutAddressSchema,
  payment_method: z.string(),
  payment_result: z.nullable(PaymentResultSchema),
});

export type CheckoutOrder = z.infer<typeof CheckoutOrderSchema>;
export type PaymentResult = NonNullable<CheckoutOrder["payment_result"]>;

export type PaymentDataEntry = { key: string; value: string | boolean };

export type BillingAddress = {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
};

export type ShippingAddress = Omit<BillingAddress, "email" | "phone">;
