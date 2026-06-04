import { z } from "zod/mini";

// WooCommerce sometimes returns booleans as 0/1 integers
const wcBoolean = z.preprocess(
  (val) => (typeof val === "number" ? val !== 0 : val),
  z.boolean(),
);

const PricesSchema = z.object({
  price: z.string(),
  regular_price: z.string(),
  sale_price: z.string(),
  currency_code: z.string(),
  currency_symbol: z.string(),
  currency_minor_unit: z.int(),
  currency_decimal_separator: z.string(),
  currency_thousand_separator: z.string(),
  currency_prefix: z.string(),
  currency_suffix: z.string(),
});

const ImageSchema = z.object({
  id: z.int(),
  src: z.string(),
  thumbnail: z.string(),
  srcset: z.string(),
  sizes: z.string(),
  name: z.string(),
  alt: z.string(),
});

const TermSchema = z.object({
  id: z.int(),
  name: z.string(),
  slug: z.string(),
});

const AddToCartSchema = z.object({
  text: z.string(),
  description: z.string(),
  url: z.string(),
  minimum: z.int(),
  maximum: z.int(),
  multiple_of: z.int(),
});

export const ProductSchema = z.object({
  id: z.int(),
  name: z.string(),
  slug: z.string(),
  permalink: z.string(),
  description: z.string(),
  short_description: z.string(),
  on_sale: wcBoolean,
  prices: PricesSchema,
  images: z.array(ImageSchema),
  featured: wcBoolean,
  categories: z.array(TermSchema),
  tags: z.array(TermSchema),
  is_in_stock: wcBoolean,
  is_on_backorder: wcBoolean,
  low_stock_remaining: z.nullable(z.int()),
  add_to_cart: AddToCartSchema,
  average_rating: z.string(),
  review_count: z.int(),
});

export type Product = z.infer<typeof ProductSchema>;
