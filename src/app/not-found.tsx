import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <section className="relative flex min-h-[calc(100vh-113px)] items-center overflow-hidden border-b border-border px-2">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto relative z-10">
        <p className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.3em] text-accent">
          Error 404
        </p>

        <h1 className="font-display text-6xl font-bold uppercase leading-[0.9] tracking-tighter sm:text-8xl lg:text-9xl">
          PAGE
          <br />
          NOT <span className="text-glow text-accent">FOUND</span>
        </h1>

        <p className="mt-8 max-w-md text-lg text-muted-foreground leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-10 flex gap-4 flex-wrap">
          <Button variant="neon" size="xl" asChild>
            <Link href="/search">
              Shop Now <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="xl" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>

      <div className="absolute right-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-accent/50 to-transparent" />
    </section>
  );
};

export default NotFound;
