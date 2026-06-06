import type { Metadata } from "next";
import { CompleteCheckout } from "./_components/CompleteCheckout";

export const metadata: Metadata = {
  title: "Finalizing Order",
  robots: { index: false },
};

export default async function CheckoutComplete({
  searchParams,
}: {
  searchParams: Promise<{ redirect_status?: string }>;
}) {
  const { redirect_status } = await searchParams;

  return <CompleteCheckout redirectStatus={redirect_status ?? null} />;
}
