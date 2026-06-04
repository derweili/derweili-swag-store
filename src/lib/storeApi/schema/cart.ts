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

export const CartWithProductsSchema = z.object({
  items: z.array(CartItemSchema),
  items_count: z.int(),
  totals: CartTotalsSchema,
  errors: z.array(z.unknown()),
});

export type Cart = z.infer<typeof CartWithProductsSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
