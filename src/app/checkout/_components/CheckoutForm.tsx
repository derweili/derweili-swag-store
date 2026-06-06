"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Lock, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { placeOrder, savePendingCheckout } from "@/lib/cart/actions";
import type { Cart } from "@/lib/storeApi/schema/cart";
import type { BillingAddress } from "@/lib/storeApi/schema/checkout";
import { getStripe } from "@/lib/stripe/client";

interface CheckoutFormProps {
  cart: Cart;
  orderId: number;
  orderKey: string;
  clientSecret: string;
  publishableKey: string;
}

function formatAmount(
  minorUnits: string,
  minorUnit: number,
  prefix: string,
): string {
  const n = parseInt(minorUnits, 10) / 10 ** minorUnit;
  return `${prefix}${n.toFixed(minorUnit)}`;
}

function CheckoutFormInner({
  cart,
  orderId,
  orderKey,
  publishableKey,
}: Omit<CheckoutFormProps, "clientSecret">) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const { totals } = cart;

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
        const { error: submitError } = await elements.submit();
        if (submitError) {
          setError(submitError.message ?? "Please check your payment details.");
          return;
        }

        // Persisted so /checkout/complete can finalize the order if the
        // customer is redirected away to their bank (iDEAL, Bancontact, …).
        await savePendingCheckout(orderId, orderKey, publishableKey, billing);

        const returnUrl = new URL("/checkout/complete", window.location.origin);
        returnUrl.searchParams.set("order_id", String(orderId));
        returnUrl.searchParams.set("order_key", orderKey);

        const { error: confirmError } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: returnUrl.toString(),
            payment_method_data: {
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
            },
          },
          redirect: "if_required",
        });

        if (confirmError) {
          setError(confirmError.message ?? "Payment failed. Please try again.");
          return;
        }

        // No redirect occurred — the payment resolved inline (e.g. cards).
        const { orderKey: finalOrderKey, paymentResult } =
          await placeOrder(billing);

        if (paymentResult?.payment_status === "pending") {
          const pendingClientSecret = paymentResult.payment_details.find(
            (d) => d.key === "client_secret",
          )?.value as string | undefined;

          if (pendingClientSecret) {
            const { error: pendingConfirmError } = await stripe.confirmPayment({
              clientSecret: pendingClientSecret,
              confirmParams: { return_url: returnUrl.toString() },
              redirect: "if_required",
            });
            if (pendingConfirmError) {
              setError(
                pendingConfirmError.message ??
                  "3D Secure authentication failed.",
              );
              return;
            }
          }
        }

        router.push(`/thank-you?key=${encodeURIComponent(finalOrderKey)}`);
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
              <Input
                name="first_name"
                required
                placeholder="First name"
                className="h-14"
              />
              <Input
                name="last_name"
                required
                placeholder="Last name"
                className="h-14"
              />
            </div>
            <Input
              name="company"
              placeholder="Company (optional)"
              className="h-14"
            />
            <Input
              name="address_1"
              required
              placeholder="Address"
              className="h-14"
            />
            <Input
              name="address_2"
              placeholder="Apartment, suite, etc. (optional)"
              className="h-14"
            />
            <div className="grid grid-cols-3 gap-3">
              <Input
                name="postcode"
                required
                placeholder="Postal code"
                className="h-14"
              />
              <Input
                name="city"
                required
                placeholder="City"
                className="h-14 col-span-2"
              />
            </div>
            <Input
              name="state"
              placeholder="State / Province (optional)"
              className="h-14"
            />
            <input type="hidden" name="country" value="DE" />
            <div className="h-14 flex items-center px-3 border border-border bg-secondary/30 text-muted-foreground text-sm">
              Germany (DE)
            </div>
            <Input
              name="phone"
              placeholder="Phone (optional)"
              className="h-14"
            />
          </div>
        </section>

        {/* Shipping method — static UI */}
        <section>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-5">
            Shipping Method
          </h2>
          <div className="border border-border divide-y divide-border">
            <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/40 transition">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="ship"
                  defaultChecked
                  className="accent-accent"
                />
                <span className="font-display uppercase text-sm tracking-wider">
                  Standard (3–5 days)
                </span>
              </div>
              <span className="font-display font-bold text-accent">
                {totals.total_shipping === null
                  ? "Calculated at next step"
                  : totals.total_shipping === "0"
                    ? "FREE"
                    : formatAmount(
                        totals.total_shipping,
                        totals.currency_minor_unit,
                        totals.currency_prefix,
                      )}
              </span>
            </label>
          </div>
        </section>

        {/* Payment — Stripe Payment Element */}
        <section>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-2">
            Payment
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
            <Lock className="h-3 w-3" /> All transactions are secure and
            encrypted
          </p>

          <div className="border border-border p-4">
            <PaymentElement options={{ layout: "tabs" }} />
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
          disabled={
            isPending || !stripe || !elements || cart.items.length === 0
          }
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
                {formatAmount(
                  totals.total_items,
                  totals.currency_minor_unit,
                  totals.currency_prefix,
                )}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span className="uppercase tracking-wider text-xs">Shipping</span>
              <span>
                {totals.total_shipping === null
                  ? "—"
                  : totals.total_shipping === "0"
                    ? "FREE"
                    : formatAmount(
                        totals.total_shipping,
                        totals.currency_minor_unit,
                        totals.currency_prefix,
                      )}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span className="uppercase tracking-wider text-xs">Tax</span>
              <span>
                {formatAmount(
                  totals.total_tax,
                  totals.currency_minor_unit,
                  totals.currency_prefix,
                )}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-border pt-4 mt-4">
            <span className="font-display uppercase tracking-wider text-sm">
              Total
            </span>
            <div className="text-right">
              <span className="text-xs text-muted-foreground uppercase mr-2">
                {totals.currency_code}
              </span>
              <span className="font-display text-3xl font-bold text-accent">
                {formatAmount(
                  totals.total_price,
                  totals.currency_minor_unit,
                  totals.currency_prefix,
                )}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function CheckoutForm({
  cart,
  orderId,
  orderKey,
  clientSecret,
  publishableKey,
}: CheckoutFormProps) {
  const stripePromise = useMemo(
    () => getStripe(publishableKey),
    [publishableKey],
  );

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: "night" } }}
    >
      <CheckoutFormInner
        cart={cart}
        orderId={orderId}
        orderKey={orderKey}
        publishableKey={publishableKey}
      />
    </Elements>
  );
}
