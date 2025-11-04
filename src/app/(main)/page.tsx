import ProductCard from "@/components/products/product-card";
import Paginator from "@/components/shared/paginator";
import SearchBar from "@/components/shared/search-bar";
import PageSizeInput from "@/components/shared/page-size-input";
import SortControls from "@/components/shared/sort-controls";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ProductLite } from "@/types/product";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@/lib/constants";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    pageSize?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params?.q?.trim() || "";
  const rawSize = Number(params?.pageSize);
  const PAGE_SIZE =
    Number.isFinite(rawSize) && rawSize > 0 && rawSize <= MAX_PAGE_SIZE
      ? rawSize
      : DEFAULT_PAGE_SIZE;

  const sortParam = (params?.sort || "new").toString();
  const sortBy =
    sortParam === "old"
      ? "oldest"
      : sortParam === "az"
      ? "name-asc"
      : sortParam === "za"
      ? "name-desc"
      : "newest";

  const rawPage = Math.max(1, Number(params?.page ?? "1") || 1);
  const apiUrl = new URL(
    `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/api/products`
  );
  if (query) apiUrl.searchParams.set("search", query);
  apiUrl.searchParams.set("sortBy", sortBy);
  apiUrl.searchParams.set("page", rawPage.toString());
  apiUrl.searchParams.set("pageSize", PAGE_SIZE.toString());

  const response = await fetch(apiUrl.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();
  const items: ProductLite[] = data.products;
  const { total, page, totalPages } = data.pagination;

  const showingFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, total);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Product Catalog
        </h1>
      </div>

      {/* Search + Sort container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow">
        <div className="flex items-center justify-between gap-4">
          <SearchBar />
          <SortControls />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing {showingFrom}-{showingTo} of {total} products
        </p>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>
          <PageSizeInput defaultValue={3} min={1} max={24} />
        </div>
      </div>

      {items.length === 0 ? (
        <Alert className="rounded-2xl p-10 text-center border-slate-200">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-100 text-slate-500 grid place-items-center">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <AlertTitle className="font-medium text-slate-700">
            {query ? `No products found for "${query}"` : "No products yet"}
          </AlertTitle>
          <AlertDescription className="text-sm text-slate-500">
            {query
              ? "Try a different search term"
              : 'Click "Add product" to create your first one.'}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <Paginator
        page={page}
        totalPages={totalPages}
        q={query}
        pageSize={PAGE_SIZE}
        sort={sortParam}
      />
    </section>
  );
}
