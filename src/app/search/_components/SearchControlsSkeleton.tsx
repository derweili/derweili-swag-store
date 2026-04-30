const SearchControlsSkeleton = () => (
  <div className="mb-10 space-y-8">
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="h-14 flex-1 animate-pulse bg-muted" />
      <div className="h-14 w-32 shrink-0 animate-pulse bg-muted" />
    </div>
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
      <div className="h-4 w-20 animate-pulse bg-muted" />
      <div className="h-12 w-48 animate-pulse bg-muted" />
    </div>
  </div>
);

export default SearchControlsSkeleton;
