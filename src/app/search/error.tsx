"use client";

type SearchErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const SearchError = ({ reset }: SearchErrorProps) => (
  <div className="flex flex-col items-center justify-center py-20">
    <p className="font-display text-xl font-bold uppercase tracking-wider text-muted-foreground">
      Something went wrong
    </p>
    <p className="mt-2 text-center text-sm text-muted-foreground">
      Search is temporarily unavailable.
    </p>
    <button
      type="button"
      onClick={reset}
      className="mt-6 inline-flex h-12 items-center justify-center border border-border bg-secondary px-8 font-display text-xs font-semibold uppercase tracking-widest text-foreground transition-all hover:border-accent hover:text-accent"
    >
      Try again
    </button>
  </div>
);

export default SearchError;
