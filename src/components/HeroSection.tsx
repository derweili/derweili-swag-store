import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[calc(100vh-113px)] items-center overflow-hidden border-b border-border">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto relative z-10 flex flex-col lg:flex-row">
        <div className="max-w-4xl">
          <p className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.3em] text-accent">
            New Collection 2026
          </p>

          <h1 className="font-display text-6xl font-bold uppercase leading-[0.9] tracking-tighter sm:text-8xl lg:text-9xl">
            WEAR
            <br />
            THE <span className="text-glow text-accent">EDGE</span>
          </h1>

          <p className="mt-8 max-w-md text-lg text-muted-foreground leading-relaxed">
            Premium streetwear for those who refuse to blend in. Limited drops,
            unlimited attitude.
          </p>

          <div className="mt-10 flex gap-4">
            <Button variant="neon" size="xl" asChild>
              <Link href="/search">
                Shop Now <ArrowRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/search">Explore</Link>
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <Image
            src="/hero.png"
            priority
            alt="Hero Image"
            width={750}
            height={500}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Decorative accent line */}
      <div className="absolute right-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-accent/50 to-transparent" />
    </section>
  );
};

export default HeroSection;
