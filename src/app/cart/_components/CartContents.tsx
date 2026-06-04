"use client";

import { Loader2, Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { removeCartItem, updateCartItem } from "@/lib/cart/actions";
import type { Cart } from "@/lib/storeApi/schema/cart";
import { EmptyCart } from "./EmptyCart";

interface CartContentsProps {
  variant?: "drawer" | "page";
  cart: Cart;
}

function slugFromPermalink(permalink: string): string {
  try {
    const url = new URL(permalink);
    const segments = url.pathname.replace(/\/$/, "").split("/");
    return segments[segments.length - 1] ?? "";
  } catch {
    return "";
  }
}

const CartContents = ({
  variant = "drawer",
  cart: cartProp,
}: CartContentsProps) => {
  const router = useRouter();
  const [cart, setCart] = useState(cartProp);
  const [isPending, startTransition] = useTransition();
  const [pendingLineId, setPendingLineId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setCart(cartProp);
  }, [cartProp]);

  const { items } = cart;
  const subtotalAmount =
    parseInt(cart.totals.total_items, 10) /
    Math.pow(10, cart.totals.currency_minor_unit);

  if (items.length === 0) {
    return <EmptyCart />;
  }

  const lineBusy = (lineId: string) => isPending && pendingLineId === lineId;

  function runLineAction(lineId: string, fn: () => Promise<Cart>) {
    setActionError(null);
    setPendingLineId(lineId);
    startTransition(async () => {
      try {
        const updatedCart = await fn();
        setCart(updatedCart);
        router.refresh();
      } catch {
        setActionError("Something went wrong. Please try again.");
      } finally {
        setPendingLineId(null);
      }
    });
  }

  const removeItem = (lineId: string) => {
    runLineAction(lineId, () => removeCartItem(lineId));
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(lineId);
      return;
    }
    runLineAction(lineId, () => updateCartItem(lineId, quantity));
  };

  const isPage = variant === "page";

  return (
    <div className="flex flex-1 flex-col h-full">
      {actionError ? (
        <p className="mb-4 text-sm font-medium text-destructive" role="alert">
          {actionError}
        </p>
      ) : null}
      <div className={`flex-1 overflow-y-auto ${isPage ? "" : "-mx-6 px-6"}`}>
        <ul className="divide-y divide-border">
          {items.map((item) => {
            const busy = lineBusy(item.key);
            const productSlug = slugFromPermalink(item.permalink);
            const lineTotal =
              parseInt(item.totals.line_total, 10) /
              Math.pow(10, item.totals.currency_minor_unit);
            const firstImage = item.images[0];

            return (
              <li key={item.key} className="flex gap-4 py-5">
                <Link
                  href={`/products/${productSlug}`}
                  className={`relative shrink-0 overflow-hidden bg-secondary ${
                    isPage ? "h-32 w-32" : "h-24 w-24"
                  }`}
                >
                  {firstImage && (
                    <Image
                      src={firstImage.src}
                      alt={firstImage.alt || item.name}
                      width={100}
                      height={100}
                      className="h-full w-full object-cover"
                    />
                  )}
                </Link>

                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div className="flex justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/products/${productSlug}`}
                        className="font-display text-sm font-bold uppercase tracking-tight hover:text-accent transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      disabled={busy}
                      aria-label={`Remove ${item.name}`}
                      className="text-muted-foreground transition-colors hover:text-destructive shrink-0 disabled:opacity-40"
                    >
                      {busy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-end flex-wrap justify-between gap-2 mt-2">
                    <div className="flex items-center border border-border">
                      {item.quantity_limits.editable ? (
                        <>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            disabled={busy}
                            className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="flex h-8 w-10 items-center justify-center border-x border-border font-display text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            disabled={busy || item.quantity >= item.quantity_limits.maximum}
                            className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <span className="flex h-8 items-center px-3 font-display text-sm font-semibold">
                          Qty: {item.quantity}
                        </span>
                      )}
                    </div>
                    <p className="font-display font-bold text-accent">
                      {item.totals.currency_prefix}
                      {lineTotal.toFixed(item.totals.currency_minor_unit)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div
        className={`border-t border-border pt-6 mt-6 ${isPage ? "" : "-mx-6 px-6"}`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-display text-sm uppercase tracking-widest text-muted-foreground">
            Subtotal
          </span>
          <span className="font-display text-2xl font-bold text-accent">
            {cart.totals.currency_prefix}
            {subtotalAmount.toFixed(cart.totals.currency_minor_unit)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
          Shipping & taxes calculated at checkout
        </p>
        <div className="flex flex-col gap-2">
          <Button variant="neon" size="lg" className="w-full">
            Checkout
          </Button>
          {!isPage && (
            <a href="/cart">
              <Button variant="outline" size="lg" className="w-full">
                View Cart
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartContents;
