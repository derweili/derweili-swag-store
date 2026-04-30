const PromotionBannerSkeleton = () => (
  <div
    className="overflow-hidden border-y border-accent/20 bg-accent/5"
    aria-hidden
  >
    <div className="flex gap-8 py-3">
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={`promo-skel-${String(i)}`}
          className="flex min-w-[280px] flex-1 items-center gap-4"
        >
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4 rounded-full bg-muted/60" />
          <div className="h-4 flex-1 max-w-md animate-pulse rounded bg-muted" />
          <div className="h-7 w-20 animate-pulse rounded border border-border bg-muted/40" />
        </div>
      ))}
    </div>
    <p className="sr-only">Loading promotion</p>
  </div>
);

export default PromotionBannerSkeleton;
