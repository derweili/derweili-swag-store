import type { Metadata } from "next";
import { ArrowRight, Check, Mail, Package } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

async function ThankYouBody({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <div className="container mx-auto pt-24 pb-20 max-w-3xl">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="relative mb-6">
          <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center neon-border">
            <Check className="h-10 w-10 text-accent-foreground" strokeWidth={3} />
          </div>
        </div>
        <p className="text-xs uppercase tracking-[0.4em] text-accent mb-3">Order Confirmed</p>
        <h1 className="font-display text-5xl sm:text-6xl font-bold uppercase tracking-tight mb-4">
          Thank You.
        </h1>
        <p className="text-muted-foreground max-w-md">
          Your order is locked in. We&apos;ve sent a confirmation to your inbox with all the
          details.
        </p>
      </div>

      <div className="border border-border bg-card p-6 sm:p-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1">
              Order Number
            </p>
            <p className="font-display text-2xl font-bold">{orderId ?? "—"}</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-border p-5 flex gap-4">
          <Mail className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider mb-1">
              Confirmation
            </p>
            <p className="text-xs text-muted-foreground">Receipt is on its way to your email.</p>
          </div>
        </div>
        <div className="border border-border p-5 flex gap-4">
          <Package className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider mb-1">
              Shipping
            </p>
            <p className="text-xs text-muted-foreground">
              You&apos;ll get a tracking link once it ships.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/">
          <Button variant="neon" size="lg" className="w-full sm:w-auto">
            Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ThankYou({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  return (
    <Suspense>
      <ThankYouBody searchParams={searchParams} />
    </Suspense>
  );
}
