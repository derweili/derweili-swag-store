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

const PaymentResultSchema = z.object({
  payment_status: z.string(),
  redirect_url: z.string(),
  payment_details: z.array(z.unknown()),
});

export const CheckoutOrderSchema = z.object({
  order_id: z.int(),
  order_number: z.string(),
  status: z.string(),
  billing_address: CheckoutAddressSchema,
  shipping_address: CheckoutAddressSchema,
  payment_method: z.string(),
  payment_result: z.nullable(PaymentResultSchema),
});

export type CheckoutOrder = z.infer<typeof CheckoutOrderSchema>;

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
