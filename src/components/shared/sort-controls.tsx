"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const OPTIONS = [
  { value: "new", label: "Newest" },
  { value: "old", label: "Oldest" },
  { value: "az", label: "A–Z" },
  { value: "za", label: "Z–A" },
] as const;

export default function SortControls() {
  const params = useSearchParams();
  const router = useRouter();
  const current = params.get("sort") || "new";

  const onValueChange = (value: string) => {
    const next = new URLSearchParams(params);
    if (value === "new") next.delete("sort");
    else next.set("sort", value);
    next.delete("page");
    router.push(`/?${next.toString()}`);
  };

  const currentLabel =
    OPTIONS.find((o) => o.value === current)?.label ?? "Newest";

  return (
    <Select value={current} onValueChange={onValueChange}>
      <SelectTrigger className="w-40">
        <span className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-slate-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12M8 12h8M8 17h4M3 7h.01M3 12h.01M3 17h.01"
            />
          </svg>
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span>{currentLabel}</span>
        </span>
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
