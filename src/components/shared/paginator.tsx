"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Paginator({
  page,
  totalPages,
  q,
  pageSize,
  sort,
}: {
  page: number;
  totalPages: number;
  q?: string;
  pageSize?: number;
  sort?: string;
}) {
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  const hrefFor = (p: number) => {
    const ps = new URLSearchParams();
    if (p > 1) ps.set("page", String(p));
    if (q?.trim()) ps.set("q", q.trim());
    if (pageSize) ps.set("pageSize", String(pageSize));
    if (sort && sort !== "new") ps.set("sort", sort);
    const qs = ps.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <nav className="mt-6 flex items-center justify-center gap-3">
      <Button variant="outline" size="sm" asChild disabled={page <= 1}>
        <Link href={hrefFor(prev)} aria-disabled={page <= 1}>
          Prev
        </Link>
      </Button>
      <span className="text-sm text-slate-600">
        Page <b>{page}</b> / {totalPages}
      </span>
      <Button variant="outline" size="sm" asChild disabled={page >= totalPages}>
        <Link href={hrefFor(next)} aria-disabled={page >= totalPages}>
          Next
        </Link>
      </Button>
    </nav>
  );
}
