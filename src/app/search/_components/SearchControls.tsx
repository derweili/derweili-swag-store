"use client";

import { Loader2, Search as SearchIcon } from "lucide-react";
import Form from "next/form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useFormStatus } from "react-dom";
import { useDebounceValue } from "usehooks-ts";

const QUERY_DEBOUNCE_MS = 350;
const AUTOSEARCH_MIN_CHARS = 3;

type SearchControlsProps = {
  categories: readonly string[];
  initialQuery: string;
  initialCategory: string;
};

function buildSearchHref(
  pathname: string,
  query: string,
  category: string,
): string {
  const params = new URLSearchParams();
  const q = query.trim();
  const cat =
    category && category !== "" && category !== "All" ? category.trim() : "";

  if (q.length > 0) params.set("q", q);
  if (cat.length > 0) params.set("category", cat);

  const qs = params.toString();
  return qs === "" ? pathname : `${pathname}?${qs}`;
}

function SubmitButton({
  isTransitionPending,
}: {
  isTransitionPending: boolean;
}) {
  const { pending: isFormPending } = useFormStatus();
  const isPending = isTransitionPending || isFormPending;
  return (
    <button
      type="submit"
      disabled={isPending}
      className="inline-flex h-14 shrink-0 items-center justify-center border border-accent bg-accent px-8 font-display text-xs font-semibold uppercase tracking-widest text-accent-foreground transition-all hover:bg-accent/90 disabled:opacity-70"
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
      ) : (
        "Search"
      )}
    </button>
  );
}

const SearchControls = ({
  categories,
  initialQuery,
  initialCategory,
}: SearchControlsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /** Text in the search field; becomes the `q` search param once applied to the URL. */
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [debouncedQueryInput] = useDebounceValue(queryInput, QUERY_DEBOUNCE_MS);

  /** True while Next.js is applying `router.replace()` and streaming the updated search route (RSC refresh, not a full document reload). */
  const [isSearchRouteTransitionPending, startSearchRouteTransition] =
    useTransition();

  /**
   * `{ trimmed q, category }` we last kicked off via `router.replace`, or that we synced from the URL after
   * `useSearchParams` updates (e.g. back/forward).
   *
   * While `startSearchRouteTransition` runs, clients may still observe the previous `useSearchParams()` values even
   * though `debouncedQueryInput` already matches the navigation target—we would wrongly call `replaceSearchRoute`
   * again unless we compare against this snapshot (written synchronously in `replaceSearchRoute`).
   *
   * A **ref** is used because this is bookkeeping only (no UI); `useState` would re-render without helping render output.
   */
  const routerAppliedSearchParamsRef = useRef({
    query: initialQuery.trim(),
    category: initialCategory,
  });

  const urlQuery = searchParams.get("q") ?? "";
  const urlCategoryRaw = searchParams.get("category");
  const urlCategory =
    urlCategoryRaw && categories.includes(urlCategoryRaw)
      ? urlCategoryRaw
      : "All";

  useEffect(() => {
    setQueryInput(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    routerAppliedSearchParamsRef.current = {
      query: urlQuery.trim(),
      category: urlCategory,
    };
  }, [urlQuery, urlCategory]);

  const replaceSearchRoute = useCallback(
    (query: string, category: string) => {
      const href = buildSearchHref(pathname, query, category);
      startSearchRouteTransition(() => {
        router.replace(href, { scroll: false });
      });
      routerAppliedSearchParamsRef.current = {
        query: query.trim(),
        category,
      };
    },
    [pathname, router],
  );

  const categoryOptions = useMemo(
    () => ["All" as const, ...categories.filter((c) => c.trim() !== "")],
    [categories],
  );

  useEffect(() => {
    const trimmed = debouncedQueryInput.trim();

    if (trimmed.length >= AUTOSEARCH_MIN_CHARS) {
      if (
        trimmed !== routerAppliedSearchParamsRef.current.query ||
        urlCategory !== routerAppliedSearchParamsRef.current.category
      ) {
        replaceSearchRoute(debouncedQueryInput, urlCategory);
      }
      return;
    }

    if (
      trimmed.length === 0 &&
      routerAppliedSearchParamsRef.current.query.length > 0
    ) {
      replaceSearchRoute("", urlCategory);
    }
  }, [debouncedQueryInput, replaceSearchRoute, urlCategory]);

  const handleCategoryChange = (next: string) => {
    replaceSearchRoute(queryInput, next);
  };

  return (
    <div className="mb-10 space-y-8">
      {/*
       * next/form with action="" navigates to the current route, encoding named inputs as
       * search params. The hidden category input preserves the active filter across form
       * submissions. Debounced auto-search and category changes still use router.replace()
       * via replaceSearchRoute; useFormStatus covers the button pending state for direct
       * form submissions while isSearchRouteTransitionPending covers the rest.
       */}
      <Form
        action=""
        replace
        scroll={false}
        className="flex flex-col gap-3 sm:flex-row"
      >
        {urlCategory !== "All" && (
          <input type="hidden" name="category" value={urlCategory} />
        )}
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            id="product-search-input"
            name="q"
            type="search"
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="Search products…"
            enterKeyHint="search"
            autoComplete="off"
            className="h-14 w-full border border-border bg-secondary pl-12 pr-4 font-display text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:neon-border transition-all"
          />
        </div>
        <SubmitButton isTransitionPending={isSearchRouteTransitionPending} />
      </Form>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
        <label
          htmlFor="product-category-filter"
          className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Category
        </label>
        <select
          id="product-category-filter"
          name="category"
          value={urlCategory}
          onChange={(event) => handleCategoryChange(event.target.value)}
          disabled={isSearchRouteTransitionPending}
          className="h-12 w-full max-w-md border border-border bg-secondary px-4 font-display text-sm text-foreground focus:border-accent focus:outline-none focus:neon-border disabled:opacity-70 sm:w-auto"
        >
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {isSearchRouteTransitionPending ? (
        <p className="sr-only" aria-live="polite">
          Updating search results
        </p>
      ) : null}
    </div>
  );
};

export default SearchControls;
