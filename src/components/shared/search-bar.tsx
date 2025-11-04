"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (value: string) => {
    setQuery(value);
    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set("q", value.trim());
      params.delete("page");
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <div className="relative flex-1">
      <svg
        className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <Input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search products by name or category..."
        className="w-full h-12 pl-10 pr-10"
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
        </div>
      )}
    </div>
  );
}
