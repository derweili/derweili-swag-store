import { cookies } from "next/headers";

export type OrderConfirmationItem = {
  name: string;
  quantity: number;
  imageUrl: string | null;
  lineTotal: string;
  currencyPrefix: string;
  currencyMinorUnit: number;
};

export type OrderConfirmationTotals = {
  subtotal: string;
  shipping: string | null;
  tax: string;
  total: string;
  currencyPrefix: string;
  currencyMinorUnit: number;
  currencyCode: string;
};

export type OrderConfirmation = {
  orderKey: string;
  orderNumber: string;
  billingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    postcode: string;
    country: string;
    email: string;
  };
  items: OrderConfirmationItem[];
  totals: OrderConfirmationTotals;
};

const COOKIE_NAME = "order_confirmation";

export async function setOrderConfirmation(data: OrderConfirmation): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, JSON.stringify(data), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours — long enough to refresh the page
  });
}

export async function getOrderConfirmation(): Promise<OrderConfirmation | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OrderConfirmation;
  } catch {
    return null;
  }
}
