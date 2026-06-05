import { z } from "zod/mini";

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
  on_sale: z.coerce.boolean(),
  prices: PricesSchema,
  images: z.array(ImageSchema),
  featured: z.coerce.boolean(),
  categories: z.array(TermSchema),
  tags: z.array(TermSchema),
  is_in_stock: z.coerce.boolean(),
  is_on_backorder: z.coerce.boolean(),
  low_stock_remaining: z.nullable(z.int()),
  add_to_cart: AddToCartSchema,
  average_rating: z.string(),
  review_count: z.int(),
});

export type Product = z.infer<typeof ProductSchema>;
