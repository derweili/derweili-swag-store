"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { completePendingCheckout } from "@/lib/cart/actions";
import { getStripe } from "@/lib/stripe/client";

interface CompleteCheckoutProps {
  redirectStatus: string | null;
}

export function CompleteCheckout({ redirectStatus }: CompleteCheckoutProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (redirectStatus === "failed") {
      setError("Your payment could not be completed. Please try again.");
      return;
    }

    let cancelled = false;

    async function finalize() {
      try {
        const result = await completePendingCheckout();
        if (cancelled) return;

        if (!result) {
          setError("We couldn't find your checkout session. Please try again.");
          return;
        }

        const { orderKey, paymentResult, publishableKey } = result;

        if (paymentResult?.payment_status === "pending") {
          const clientSecret = paymentResult.payment_details.find(
            (d) => d.key === "client_secret",
          )?.value as string | undefined;

          if (clientSecret) {
            const stripe = await getStripe(publishableKey);
            if (!stripe) {
              setError("Payment provider failed to load. Please try again.");
              return;
            }

            const { error: confirmError } = await stripe.confirmPayment({
              clientSecret,
              confirmParams: { return_url: window.location.href },
              redirect: "if_required",
            });

            if (confirmError) {
              setError(
                confirmError.message ?? "3D Secure authentication failed.",
              );
              return;
            }
          }
        }

        router.replace(`/thank-you?key=${encodeURIComponent(orderKey)}`);
      } catch {
        if (!cancelled) {
          setError(
            "Something went wrong finalizing your order. Please try again.",
          );
        }
      }
    }

    finalize();

    return () => {
      cancelled = true;
    };
  }, [redirectStatus, router]);

  if (error) {
    return (
      <div className="container mx-auto pt-24 pb-20 max-w-xl text-center">
        <p className="text-sm font-medium text-destructive mb-6" role="alert">
          {error}
        </p>
        <Link href="/checkout">
          <Button variant="neon" size="lg">
            Back to Checkout
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-24 pb-20 max-w-xl flex flex-col items-center text-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
      <p className="text-muted-foreground text-sm">Finalizing your order…</p>
    </div>
  );
}
