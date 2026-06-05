"use client";

import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Lock, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { placeOrder, selectShippingRate } from "@/lib/cart/actions";
import { stripePromise } from "@/lib/stripe/client";
import type { BillingAddress } from "@/lib/storeApi/schema/checkout";
import type { Cart } from "@/lib/storeApi/schema/cart";

interface CheckoutFormProps {
  cart: Cart;
}

function formatAmount(minorUnits: string, minorUnit: number, prefix: string): string {
  const n = parseInt(minorUnits, 10) / Math.pow(10, minorUnit);
  return `${prefix}${n.toFixed(minorUnit)}`;
}

// Literal hex values — CSS custom properties don't resolve inside Stripe's iframe.
// Colors derived from globals.css: --foreground: 0 0% 96%, --muted-foreground: 0 0% 55%, --destructive: 0 84% 60%
const stripeElementStyle = {
  base: {
    color: "#f5f5f5",
    fontFamily: "inherit",
    fontSize: "14px",
    "::placeholder": { color: "#8c8c8c" },
  },
  invalid: { color: "#ef4343" },
};

function CheckoutFormInner({ cart: initialCart }: CheckoutFormProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState(initialCart);

  const { totals } = cart;

  const allRates = cart.shipping_rates.flatMap((pkg) =>
    pkg.shipping_rates.map((rate) => ({ ...rate, packageId: pkg.package_id })),
  );

  function handleShippingChange(packageId: string | number, rateId: string) {
    startTransition(async () => {
      try {
        const updated = await selectShippingRate(packageId, rateId);
        setCart(updated);
      } catch {
        setError("Failed to update shipping method. Please try again.");
      }
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!stripe || !elements) return;

    const fd = new FormData(e.currentTarget);
    const get = (key: string) => (fd.get(key) as string) ?? "";

    const billing: BillingAddress = {
      email: get("email"),
      first_name: get("first_name"),
      last_name: get("last_name"),
      company: get("company"),
      address_1: get("address_1"),
      address_2: get("address_2"),
      city: get("city"),
      state: get("state"),
      postcode: get("postcode"),
      country: get("country"),
      phone: get("phone"),
    };

    setError(null);
    startTransition(async () => {
      try {
        const cardNumber = elements.getElement(CardNumberElement);
        if (!cardNumber) throw new Error("Card element not mounted");

        const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
          type: "card",
          card: cardNumber,
          billing_details: {
            name: `${billing.first_name} ${billing.last_name}`.trim(),
            email: billing.email,
            phone: billing.phone || undefined,
            address: {
              line1: billing.address_1,
              line2: billing.address_2 || undefined,
              city: billing.city,
              state: billing.state || undefined,
              postal_code: billing.postcode,
              country: billing.country,
            },
          },
        });

        if (pmError) {
          setError(pmError.message ?? "Card validation failed.");
          return;
        }

        const paymentData = [
          { key: "payment_method", value: "stripe" },
          { key: "wc-stripe-payment-method", value: paymentMethod.id },
          { key: "wc-stripe-is-deferred-intent", value: true },
        ];

        const { orderKey, paymentResult } = await placeOrder(billing, "stripe", paymentData);

        if (paymentResult?.payment_status === "requires_action") {
          const clientSecret = paymentResult.payment_details.find(
            (d) => d.key === "client_secret",
          )?.value as string | undefined;

          if (!clientSecret) {
            setError("3D Secure authentication required but no client secret received.");
            return;
          }

          const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);
          if (confirmError) {
            setError(confirmError.message ?? "3D Secure authentication failed.");
            return;
          }
        }

        router.push(`/thank-you?key=${encodeURIComponent(orderKey)}`);
      } catch {
        setError("Something went wrong placing your order. Please try again.");
      }
    });
  }

  return (
    <div className="grid lg:grid-cols-[1fr_440px] gap-12">
      {/* LEFT — form */}
      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Contact */}
        <section>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-5">
            Contact
          </h2>
          <Input
            name="email"
            required
            type="email"
            placeholder="Email address"
            className="h-14"
          />
          <p className="text-xs text-muted-foreground mt-3">
            We&apos;ll send your order confirmation to this address.
          </p>
        </section>

        {/* Delivery */}
        <section>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-5">
            Delivery
          </h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input name="first_name" required placeholder="First name" className="h-14" />
              <Input name="last_name" required placeholder="Last name" className="h-14" />
            </div>
            <Input name="company" placeholder="Company (optional)" className="h-14" />
            <Input name="address_1" required placeholder="Address" className="h-14" />
            <Input name="address_2" placeholder="Apartment, suite, etc. (optional)" className="h-14" />
            <div className="grid grid-cols-3 gap-3">
              <Input name="postcode" required placeholder="Postal code" className="h-14" />
              <Input name="city" required placeholder="City" className="h-14 col-span-2" />
            </div>
            <Input name="state" placeholder="State / Province (optional)" className="h-14" />
            <input type="hidden" name="country" value="DE" />
            <div className="h-14 flex items-center px-3 border border-border bg-secondary/30 text-muted-foreground text-sm">
              Germany (DE)
            </div>
            <Input name="phone" placeholder="Phone (optional)" className="h-14" />
          </div>
        </section>

        {/* Shipping method */}
        <section>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-5">
            Shipping Method
          </h2>
          {allRates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No shipping methods available.</p>
          ) : (
            <div className="border border-border divide-y divide-border">
              {allRates.map((rate) => {
                const priceLabel =
                  rate.price === "0"
                    ? "FREE"
                    : formatAmount(rate.price, rate.currency_minor_unit, rate.currency_prefix);
                return (
                  <label
                    key={rate.rate_id}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/40 transition"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping_rate"
                        value={rate.rate_id}
                        defaultChecked={rate.selected}
                        disabled={isPending}
                        onChange={() => handleShippingChange(rate.packageId, rate.rate_id)}
                        className="accent-accent"
                      />
                      <div>
                        <span className="font-display uppercase text-sm tracking-wider">
                          {rate.name}
                        </span>
                        {rate.delivery_time && (
                          <p className="text-xs text-muted-foreground mt-0.5">{rate.delivery_time}</p>
                        )}
                        {rate.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{rate.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="font-display font-bold text-accent">{priceLabel}</span>
                  </label>
                );
              })}
            </div>
          )}
        </section>

        {/* Payment — Stripe Elements */}
        <section>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-2">
            Payment
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
            <Lock className="h-3 w-3" /> All transactions are secure and encrypted
          </p>

          <div className="border border-border divide-y divide-border">
            <div className="p-4">
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Card number
              </label>
              <CardNumberElement
                options={{ style: stripeElementStyle, showIcon: true }}
                className="py-2"
              />
            </div>
            <div className="grid grid-cols-2 divide-x divide-border">
              <div className="p-4">
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Expiry
                </label>
                <CardExpiryElement
                  options={{ style: stripeElementStyle }}
                  className="py-2"
                />
              </div>
              <div className="p-4">
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  CVC
                </label>
                <CardCvcElement
                  options={{ style: stripeElementStyle }}
                  className="py-2"
                />
              </div>
            </div>
          </div>
        </section>

        {error && (
          <p className="text-sm font-medium text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="neon"
          size="lg"
          disabled={isPending || !stripe || cart.items.length === 0}
          className="w-full h-16 text-base"
        >
          {isPending
            ? "Processing…"
            : `Place Order — ${formatAmount(totals.total_price, totals.currency_minor_unit, totals.currency_prefix)}`}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By placing your order, you agree to our Terms and Privacy Policy.
        </p>
      </form>

      {/* RIGHT — order summary */}
      <aside className="lg:sticky lg:top-24 self-start">
        <div className="border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold uppercase tracking-tight mb-5 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-accent" /> Order Summary
          </h2>

          {cart.items.length === 0 ? (
            <p className="text-muted-foreground text-sm">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4 mb-6">
              {cart.items.map((item) => {
                const firstImage = item.images[0];
                return (
                  <li key={item.key} className="flex gap-3">
                    <div className="relative shrink-0">
                      <div className="h-16 w-16 bg-secondary overflow-hidden">
                        {firstImage && (
                          <Image
                            src={firstImage.src}
                            alt={firstImage.alt || item.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-accent text-accent-foreground text-[10px] font-bold rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-bold uppercase tracking-tight line-clamp-2">
                        {item.name}
                      </p>
                    </div>
                    <p className="font-display font-bold text-sm shrink-0">
                      {formatAmount(
                        item.totals.line_total,
                        item.totals.currency_minor_unit,
                        item.totals.currency_prefix,
                      )}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span className="uppercase tracking-wider text-xs">Subtotal</span>
              <span>
                {formatAmount(totals.total_items, totals.currency_minor_unit, totals.currency_prefix)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span className="uppercase tracking-wider text-xs">Shipping</span>
              <span>
                {totals.total_shipping === null
                  ? "—"
                  : totals.total_shipping === "0"
                  ? "FREE"
                  : formatAmount(totals.total_shipping, totals.currency_minor_unit, totals.currency_prefix)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span className="uppercase tracking-wider text-xs">Tax</span>
              <span>
                {formatAmount(totals.total_tax, totals.currency_minor_unit, totals.currency_prefix)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-border pt-4 mt-4">
            <span className="font-display uppercase tracking-wider text-sm">Total</span>
            <div className="text-right">
              <span className="text-xs text-muted-foreground uppercase mr-2">
                {totals.currency_code}
              </span>
              <span className="font-display text-3xl font-bold text-accent">
                {formatAmount(totals.total_price, totals.currency_minor_unit, totals.currency_prefix)}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function CheckoutForm({ cart }: CheckoutFormProps) {
  return (
    <Elements stripe={stripePromise} options={{ appearance: { theme: "night" } }}>
      <CheckoutFormInner cart={cart} />
    </Elements>
  );
}
