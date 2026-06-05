import type { Metadata } from "next";
import { Suspense } from "react";
import type { WebSite, WithContext } from "schema-dts";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedProductsSkeleton from "@/components/FeaturedProductsSkeleton";
import HeroSection from "@/components/HeroSection";
import HomePromotionBanner from "@/components/HomePromotionBanner";
import PromotionBannerSkeleton from "@/components/PromotionBannerSkeleton";
import { JsonLd } from "@/lib/seo/components/JsonLd";
import { getSiteUrl } from "@/lib/seo/jsonld";
import { fetchStoreConfigForSeo } from "@/lib/seo/storeConfig";
import { ArrowLeft, CreditCard, Lock, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export async function generateMetadata(): Promise<Metadata> {
  const config = await fetchStoreConfigForSeo();

  return {
    title: { absolute: config.seo.defaultTitle },
    description: config.seo.defaultDescription,
    openGraph: {
      type: "website",
      title: config.seo.defaultTitle,
      description: config.seo.defaultDescription,
    },
    twitter: {
      title: config.seo.defaultTitle,
      description: config.seo.defaultDescription,
    },
  };
}

const Checkout = async () => {
	const { items, subtotal } = {items: [], subtotal: 0}; // TODO: fetch cart data
  const [payment, setPayment] = useState("card");
  const [billingSame, setBillingSame] = useState("same");
  const [submitting, setSubmitting] = useState(false);

  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // setTimeout(() => navigate("/thank-you"), 1200);
  };

  return (
		<div className="container pt-24 pb-20 max-w-7xl">
			<Link
				href="/cart"
				className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent font-display uppercase tracking-wider"
			>
				<ArrowLeft className="h-4 w-4" /> Back to Cart
			</Link>

			<h1 className="font-display text-5xl font-bold uppercase tracking-tight sm:text-6xl mb-10">
				Checkout
			</h1>

			<div className="grid lg:grid-cols-[1fr_440px] gap-12">
				{/* LEFT — form */}
				<form onSubmit={handleSubmit} className="space-y-12">
					{/* Express */}
					<section>
						<p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
							Express Checkout
						</p>
						<div className="grid grid-cols-2 gap-3">
							<button type="button" className="h-12 bg-[#5A31F4] text-white font-display font-bold uppercase tracking-wider text-sm hover:opacity-90 transition">
								shop pay
							</button>
							<button type="button" className="h-12 bg-[#FFC439] text-black font-display font-bold uppercase tracking-wider text-sm hover:opacity-90 transition">
								PayPal
							</button>
						</div>
						<div className="flex items-center gap-4 mt-6">
							<div className="flex-1 h-px bg-border" />
							<span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Or</span>
							<div className="flex-1 h-px bg-border" />
						</div>
					</section>

					{/* Contact */}
					<section>
						<h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-5">Contact</h2>
						<Input required type="email" placeholder="Email address" className="h-14" />
						<p className="text-xs text-muted-foreground mt-3">
							We'll send order updates and exclusive drops. Unsubscribe anytime.
						</p>
					</section>

					{/* Shipping */}
					<section>
						<h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-5">Delivery</h2>
						<div className="space-y-3">
							<div className="grid grid-cols-2 gap-3">
								<Input required placeholder="First name" className="h-14" />
								<Input required placeholder="Last name" className="h-14" />
							</div>
							<Input placeholder="Company (optional)" className="h-14" />
							<Input required placeholder="Address" className="h-14" />
							<Input placeholder="Apartment, suite, etc. (optional)" className="h-14" />
							<div className="grid grid-cols-3 gap-3">
								<Input required placeholder="Postal code" className="h-14" />
								<Input required placeholder="City" className="h-14 col-span-2" />
							</div>
							<Input required placeholder="Country / Region" defaultValue="United States" className="h-14" />
							<Input placeholder="Phone (optional)" className="h-14" />
						</div>
					</section>

					{/* Shipping method */}
					<section>
						<h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-5">Shipping Method</h2>
						<div className="border border-border divide-y divide-border">
							<label className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/40 transition">
								<div className="flex items-center gap-3">
									<input type="radio" name="ship" defaultChecked className="accent-accent" />
									<span className="font-display uppercase text-sm tracking-wider">Standard (3-5 days)</span>
								</div>
								<span className="font-display font-bold text-accent">
									{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
								</span>
							</label>
							<label className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/40 transition">
								<div className="flex items-center gap-3">
									<input type="radio" name="ship" className="accent-accent" />
									<span className="font-display uppercase text-sm tracking-wider">Express (1-2 days)</span>
								</div>
								<span className="font-display font-bold text-accent">$19.99</span>
							</label>
						</div>
					</section>

					{/* Payment */}
					<section>
						<h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-2">Payment</h2>
						<p className="text-xs text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
							<Lock className="h-3 w-3" /> All transactions are secure and encrypted
						</p>
						<RadioGroup value={payment} onValueChange={setPayment} className="border border-border divide-y divide-border">
							<div>
								<label className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/40 transition">
									<div className="flex items-center gap-3">
										<RadioGroupItem value="card" id="card" />
										<span className="font-display uppercase text-sm tracking-wider">Credit Card</span>
									</div>
									<div className="flex gap-1 text-xs font-bold text-muted-foreground">
										<span className="px-2 py-1 bg-secondary">VISA</span>
										<span className="px-2 py-1 bg-secondary">MC</span>
										<span className="px-2 py-1 bg-secondary">AMEX</span>
									</div>
								</label>
								{payment === "card" && (
									<div className="p-4 bg-secondary/30 space-y-3 border-t border-border">
										<div className="relative">
											<Input placeholder="Card number" className="h-12 pr-12" />
											<CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										</div>
										<Input placeholder="Name on card" className="h-12" />
										<div className="grid grid-cols-2 gap-3">
											<Input placeholder="MM / YY" className="h-12" />
											<Input placeholder="CVC" className="h-12" />
										</div>
										<p className="text-xs text-muted-foreground">
											Stripe Elements will be wired up here.
										</p>
									</div>
								)}
							</div>
							<label className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/40 transition">
								<div className="flex items-center gap-3">
									<RadioGroupItem value="paypal" id="paypal" />
									<span className="font-display uppercase text-sm tracking-wider">PayPal</span>
								</div>
								<span className="text-xs font-bold px-2 py-1 bg-secondary">PAYPAL</span>
							</label>
							<label className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/40 transition">
								<div className="flex items-center gap-3">
									<RadioGroupItem value="klarna" id="klarna" />
									<span className="font-display uppercase text-sm tracking-wider">Klarna — Pay later</span>
								</div>
								<span className="text-xs font-bold px-2 py-1 bg-secondary">KLARNA</span>
							</label>
						</RadioGroup>
					</section>

					{/* Billing */}
					<section>
						<h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-5">Billing Address</h2>
						<RadioGroup value={billingSame} onValueChange={setBillingSame} className="border border-border divide-y divide-border">
							<label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-secondary/40 transition">
								<RadioGroupItem value="same" id="same" />
								<span className="font-display uppercase text-sm tracking-wider">Same as shipping address</span>
							</label>
							<label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-secondary/40 transition">
								<RadioGroupItem value="diff" id="diff" />
								<span className="font-display uppercase text-sm tracking-wider">Use a different billing address</span>
							</label>
						</RadioGroup>
					</section>

					<div className="flex items-start gap-3">
						<Checkbox id="save" className="mt-1" />
						<Label htmlFor="save" className="text-sm text-muted-foreground font-normal cursor-pointer">
							Save my info for faster checkout next time
						</Label>
					</div>

					<Button type="submit" variant="neon" size="lg" disabled={submitting || items.length === 0} className="w-full h-16 text-base">
						{submitting ? "Processing..." : `Pay $${total.toFixed(2)}`}
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

						{items.length === 0 ? (
							<p className="text-muted-foreground text-sm">Your cart is empty.</p>
						) : (
							<ul className="space-y-4 mb-6">
								{items.map(({ product, quantity }) => (
									<li key={product.id} className="flex gap-3">
										<div className="relative shrink-0">
											<div className="h-16 w-16 bg-secondary overflow-hidden">
												<img src={product.image} alt={product.name} className="h-full w-full object-cover" />
											</div>
											<span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-accent text-accent-foreground text-[10px] font-bold rounded-full">
												{quantity}
											</span>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
												{product.category}
											</p>
											<p className="font-display text-sm font-bold uppercase tracking-tight line-clamp-2">
												{product.name}
											</p>
										</div>
										<p className="font-display font-bold text-sm shrink-0">
											${(product.price * quantity).toFixed(2)}
										</p>
									</li>
								))}
							</ul>
						)}

						<div className="flex gap-2 mb-6">
							<Input placeholder="Discount code" className="h-11" />
							<Button type="button" variant="outline" className="h-11">Apply</Button>
						</div>

						<div className="space-y-2 border-t border-border pt-4 text-sm">
							<div className="flex justify-between text-muted-foreground">
								<span className="uppercase tracking-wider text-xs">Subtotal</span>
								<span>${subtotal.toFixed(2)}</span>
							</div>
							<div className="flex justify-between text-muted-foreground">
								<span className="uppercase tracking-wider text-xs">Shipping</span>
								<span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
							</div>
							<div className="flex justify-between text-muted-foreground">
								<span className="uppercase tracking-wider text-xs">Tax</span>
								<span>${tax.toFixed(2)}</span>
							</div>
						</div>

						<div className="flex justify-between items-end border-t border-border pt-4 mt-4">
							<span className="font-display uppercase tracking-wider text-sm">Total</span>
							<div className="text-right">
								<span className="text-xs text-muted-foreground uppercase mr-2">USD</span>
								<span className="font-display text-3xl font-bold text-accent">${total.toFixed(2)}</span>
							</div>
						</div>
					</div>
				</aside>
			</div>
		</div>
  );
};

export default Checkout;
