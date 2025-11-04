import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-7 w-64" />
          </div>
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="h-4 w-72" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <Skeleton className="aspect-video w-full" />
            <div className="p-4">
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
