type SearchResultsSkeletonProps = {
  count?: number;
};

const SearchResultsSkeleton = ({ count = 10 }: SearchResultsSkeletonProps) => (
  <div className="space-y-2">
    <p className="sr-only" aria-live="polite">
      Loading results
    </p>
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={`skeleton-${String(i)}`}
          className="aspect-3/4 animate-pulse bg-muted"
        />
      ))}
    </div>
  </div>
);

export default SearchResultsSkeleton;
