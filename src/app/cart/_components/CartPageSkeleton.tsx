export function CartPageSkeleton() {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-live="polite">
      <span className="sr-only">Loading cart</span>
      {[1, 2].map((i) => (
        <div key={i} className="flex gap-4 py-5 border-b border-border">
          <div className="h-32 w-32 shrink-0 bg-muted" />
          <div className="flex flex-1 flex-col justify-between gap-3">
            <div className="space-y-2">
              <div className="h-3 w-24 bg-muted" />
              <div className="h-4 w-3/4 max-w-md bg-muted" />
            </div>
            <div className="flex justify-between">
              <div className="h-8 w-28 bg-muted" />
              <div className="h-6 w-16 bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
