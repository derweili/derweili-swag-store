import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { CompleteCheckout } from "./_components/CompleteCheckout";

export const metadata: Metadata = {
  title: "Finalizing Order",
  robots: { index: false },
};

async function CheckoutCompleteBody({
  searchParams,
}: {
  searchParams: Promise<{ redirect_status?: string }>;
}) {
  const { redirect_status } = await searchParams;

  return <CompleteCheckout redirectStatus={redirect_status ?? null} />;
}

function CheckoutCompleteFallback() {
  return (
    <div className="container mx-auto pt-24 pb-20 max-w-xl flex flex-col items-center text-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
      <p className="text-muted-foreground text-sm">Finalizing your order…</p>
    </div>
  );
}

export default function CheckoutComplete({
  searchParams,
}: {
  searchParams: Promise<{ redirect_status?: string }>;
}) {
  return (
    <Suspense fallback={<CheckoutCompleteFallback />}>
      <CheckoutCompleteBody searchParams={searchParams} />
    </Suspense>
  );
}
