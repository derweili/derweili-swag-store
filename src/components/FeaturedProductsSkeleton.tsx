const FeaturedProductsSkeleton = () => (
  <section className="py-20" aria-busy="true">
    <div className="container mx-auto">
      <div className="mb-12 flex items-end justify-between">
        <div className="space-y-3">
          <div className="h-3 w-40 animate-pulse rounded bg-muted" />
          <div className="h-10 w-48 animate-pulse rounded bg-muted sm:w-64" />
        </div>
        <div className="hidden h-16 w-20 animate-pulse rounded bg-muted sm:block" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`featured-skel-${String(i)}`}
            className="aspect-[3/4] animate-pulse bg-muted"
          />
        ))}
      </div>
    </div>
    <p className="sr-only">Loading featured products</p>
  </section>
);

export default FeaturedProductsSkeleton;
