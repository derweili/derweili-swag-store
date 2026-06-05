import {
  ArrowRight,
  Check,
  CreditCard,
  Mail,
  MapPin,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

const ThankYou = () => {
  const { items, subtotal } = { items: [], subtotal: 0 }; // TODO: fetch cart data

  const orderNumber = "XYZ";

  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="container pt-24 pb-20 max-w-3xl">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="relative mb-6">
          <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center neon-border">
            <Check
              className="h-10 w-10 text-accent-foreground"
              strokeWidth={3}
            />
          </div>
        </div>
        <p className="text-xs uppercase tracking-[0.4em] text-accent mb-3">
          Order Confirmed
        </p>
        <h1 className="font-display text-5xl sm:text-6xl font-bold uppercase tracking-tight mb-4">
          Thank You.
        </h1>
        <p className="text-muted-foreground max-w-md">
          Your order is locked in. We've sent a confirmation to your inbox with
          all the details.
        </p>
      </div>

      <div className="border border-border bg-card p-6 sm:p-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1">
              Order Number
            </p>
            <p className="font-display text-2xl font-bold">{orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1">
              Total
            </p>
            <p className="font-display text-2xl font-bold text-accent">
              ${(items.length ? total : 0).toFixed(2)}
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <ul className="divide-y divide-border py-2">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-4 py-4">
                <div className="h-16 w-16 bg-secondary overflow-hidden shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
                    {product.category}
                  </p>
                  <p className="font-display text-sm font-bold uppercase tracking-tight line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Qty {quantity}
                  </p>
                </div>
                <p className="font-display font-bold text-sm">
                  ${(product.price * quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-border p-5 flex gap-4">
          <Mail className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider mb-1">
              Confirmation
            </p>
            <p className="text-xs text-muted-foreground">
              Receipt is on its way to your email.
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
              You'll get a tracking link once it ships.
            </p>
          </div>
        </div>
        <div className="border border-border p-5 flex gap-4">
          <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider mb-1">
              Shipping Address
            </p>
            <p className="text-xs text-muted-foreground">
              Alex Doe
              <br />
              123 Neon Street, Apt 4B
              <br />
              New York, NY 10001
              <br />
              United States
            </p>
          </div>
        </div>
        <div className="border border-border p-5 flex gap-4">
          <CreditCard className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider mb-1">
              Payment
            </p>
            <p className="text-xs text-muted-foreground">
              Visa ending in 4242
              <br />${total.toFixed(2)} charged
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
};

export default ThankYou;
