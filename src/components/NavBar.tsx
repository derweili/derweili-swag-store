import { Search, ShoppingBag } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="sticky top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tighter"
        >
          SWAG<span className="text-accent">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
          >
            Home
          </Link>
          <Link
            href="/search"
            className="text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
          >
            Search
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/search"
            className="text-muted-foreground transition-colors hover:text-accent"
          >
            <Search className="h-5 w-5" />
          </Link>
          <button
            type="button"
            className="relative text-muted-foreground transition-colors hover:text-accent"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center bg-accent text-[10px] font-bold text-accent-foreground">
              0
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
