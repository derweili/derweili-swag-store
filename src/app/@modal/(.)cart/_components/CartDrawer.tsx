"use client";

import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const isOnCart = pathname === "/cart";

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(() => router.back(), 300);
  }, [router]);

  // Drive visibility from whether the URL is /cart. This correctly handles:
  // - Initial open: isOnCart becomes true → animate in + lock scroll
  // - Forward navigation (e.g. to /checkout): isOnCart becomes false → animate out + unlock
  // - Re-opening cart after forward navigation: isOnCart becomes true again → animate in
  useEffect(() => {
    if (isOnCart) {
      document.body.style.overflow = "hidden";
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => {
        cancelAnimationFrame(raf);
        document.body.style.overflow = "";
      };
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
  }, [isOnCart]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="font-display text-lg font-bold uppercase tracking-widest">
            Cart
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
          {children}
        </div>
      </div>
    </>
  );
}
