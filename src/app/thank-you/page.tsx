import type { Metadata } from "next";
import { ArrowRight, Check, Mail, MapPin, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getOrderConfirmation } from "@/lib/cart/orderConfirmation";
import type { OrderConfirmation } from "@/lib/cart/orderConfirmation";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

function formatAmount(minorUnits: string, minorUnit: number, prefix: string): string {
  const n = parseInt(minorUnits, 10) / Math.pow(10, minorUnit);
  return `${prefix}${n.toFixed(minorUnit)}`;
}

function OrderDetails({ confirmation }: { confirmation: OrderConfirmation }) {
  const { totals } = confirmation;

  return (
    <>
      <div className="border border-border bg-card p-6 sm:p-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1">
              Order Number
            </p>
            <p className="font-display text-2xl font-bold">{confirmation.orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1">
              Total
            </p>
            <p className="font-display text-2xl font-bold text-accent">
              {formatAmount(totals.total, totals.currencyMinorUnit, totals.currencyPrefix)}
            </p>
          </div>
        </div>

        <ul className="divide-y divide-border py-2">
          {confirmation.items.map((item, i) => (
            <li key={i} className="flex gap-4 py-4">
              <div className="h-16 w-16 bg-secondary overflow-hidden shrink-0">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-bold uppercase tracking-tight line-clamp-1">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Qty {item.quantity}</p>
              </div>
              <p className="font-display font-bold text-sm shrink-0">
                {formatAmount(item.lineTotal, item.currencyMinorUnit, item.currencyPrefix)}
              </p>
            </li>
          ))}
        </ul>

        <div className="space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span className="uppercase tracking-wider text-xs">Subtotal</span>
            <span>{formatAmount(totals.subtotal, totals.currencyMinorUnit, totals.currencyPrefix)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span className="uppercase tracking-wider text-xs">Shipping</span>
            <span>
              {totals.shipping === null
                ? "—"
                : totals.shipping === "0"
                ? "FREE"
                : formatAmount(totals.shipping, totals.currencyMinorUnit, totals.currencyPrefix)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span className="uppercase tracking-wider text-xs">Tax</span>
            <span>{formatAmount(totals.tax, totals.currencyMinorUnit, totals.currencyPrefix)}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t border-border">
            <span className="uppercase tracking-wider text-xs">Total</span>
            <span className="text-accent">
              {totals.currencyCode}{" "}
              {formatAmount(totals.total, totals.currencyMinorUnit, totals.currencyPrefix)}
            </span>
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
            <p className="text-xs text-muted-foreground">
              Receipt is on its way to{" "}
              <span className="text-foreground">{confirmation.billingAddress.email}</span>.
            </p>
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
        <div className="border border-border p-5 flex gap-4 sm:col-span-2">
          <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider mb-1">
              Shipping Address
            </p>
            <p className="text-xs text-muted-foreground">
              {confirmation.billingAddress.firstName} {confirmation.billingAddress.lastName}
              <br />
              {confirmation.billingAddress.address1}
              {confirmation.billingAddress.address2
                ? `, ${confirmation.billingAddress.address2}`
                : ""}
              <br />
              {confirmation.billingAddress.postcode} {confirmation.billingAddress.city}
              <br />
              {confirmation.billingAddress.country}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function GenericConfirmation() {
  return (
    <div className="border border-border bg-card p-6 sm:p-8 mb-10">
      <p className="text-muted-foreground text-sm">
        Your order has been placed. Check your email for confirmation details.
      </p>
    </div>
  );
}

async function ThankYouBody({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const confirmation = await getOrderConfirmation();

  // Validate that the URL key matches the stored order key — prevents enumeration
  const isValid = key && confirmation && confirmation.orderKey === key;

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

      {isValid ? <OrderDetails confirmation={confirmation} /> : <GenericConfirmation />}

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
  searchParams: Promise<{ key?: string }>;
}) {
  return (
    <Suspense>
      <ThankYouBody searchParams={searchParams} />
    </Suspense>
  );
}
