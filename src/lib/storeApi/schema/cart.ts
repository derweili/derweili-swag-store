import { z } from "zod/mini";

const CartItemPricesSchema = z.object({
  price: z.string(),
  regular_price: z.string(),
  sale_price: z.string(),
  currency_code: z.string(),
  currency_symbol: z.string(),
  currency_minor_unit: z.int(),
  currency_prefix: z.string(),
  currency_suffix: z.string(),
});

const CartItemTotalsSchema = z.object({
  line_subtotal: z.string(),
  line_subtotal_tax: z.string(),
  line_total: z.string(),
  line_total_tax: z.string(),
  currency_code: z.string(),
  currency_symbol: z.string(),
  currency_minor_unit: z.int(),
  currency_prefix: z.string(),
  currency_suffix: z.string(),
});

const CartImageSchema = z.object({
  id: z.int(),
  src: z.string(),
  thumbnail: z.string(),
  srcset: z.string(),
  sizes: z.string(),
  name: z.string(),
  alt: z.string(),
});

const CartItemQuantityLimitsSchema = z.object({
  minimum: z.int(),
  maximum: z.int(),
  multiple_of: z.int(),
  editable: z.coerce.boolean(),
});

export const CartItemSchema = z.object({
  key: z.string(),
  id: z.int(),
  quantity: z.int(),
  name: z.string(),
  short_description: z.string(),
  images: z.array(CartImageSchema),
  prices: CartItemPricesSchema,
  totals: CartItemTotalsSchema,
  permalink: z.string(),
  low_stock_remaining: z.nullable(z.int()),
  quantity_limits: CartItemQuantityLimitsSchema,
});

const CartTotalsSchema = z.object({
  total_items: z.string(),
  total_items_tax: z.string(),
  total_fees: z.string(),
  total_fees_tax: z.string(),
  total_discount: z.string(),
  total_discount_tax: z.string(),
  total_shipping: z.nullable(z.string()),
  total_shipping_tax: z.nullable(z.string()),
  total_price: z.string(),
  total_tax: z.string(),
  currency_code: z.string(),
  currency_symbol: z.string(),
  currency_minor_unit: z.int(),
  currency_decimal_separator: z.string(),
  currency_thousand_separator: z.string(),
  currency_prefix: z.string(),
  currency_suffix: z.string(),
});

const ShippingRateSchema = z.object({
  rate_id: z.string(),
  name: z.string(),
  description: z.string(),
  delivery_time: z.string(),
  price: z.string(),
  taxes: z.string(),
  instance_id: z.int(),
  method_id: z.string(),
  meta_data: z.array(z.unknown()),
  selected: z.boolean(),
  currency_code: z.string(),
  currency_symbol: z.string(),
  currency_minor_unit: z.int(),
  currency_decimal_separator: z.string(),
  currency_thousand_separator: z.string(),
  currency_prefix: z.string(),
  currency_suffix: z.string(),
});

const ShippingPackageSchema = z.object({
  package_id: z.union([z.int(), z.string()]),
  name: z.string(),
  shipping_rates: z.array(ShippingRateSchema),
});

export const CartWithProductsSchema = z.object({
  items: z.array(CartItemSchema),
  items_count: z.int(),
  totals: CartTotalsSchema,
  errors: z.array(z.unknown()),
  shipping_rates: z.array(ShippingPackageSchema),
});

export type ShippingRate = z.infer<typeof ShippingRateSchema>;
export type ShippingPackage = z.infer<typeof ShippingPackageSchema>;

export type Cart = z.infer<typeof CartWithProductsSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
