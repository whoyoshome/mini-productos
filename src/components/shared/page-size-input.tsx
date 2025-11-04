"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_SIZE, MIN_PAGE_SIZE, MAX_PAGE_SIZE } from "@/lib/constants";

type Props = {
  defaultValue?: number;
  min?: number;
  max?: number;
  className?: string;
};

export default function PageSizeInput({
  defaultValue = DEFAULT_PAGE_SIZE,
  min = MIN_PAGE_SIZE,
  max = MAX_PAGE_SIZE,
  className = "",
}: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const currentPageSize = useMemo(() => {
    const n = Number(sp.get("pageSize"));
    if (!Number.isFinite(n)) return null;
    const clamped = Math.max(min, Math.min(max, Math.floor(n)));
    return clamped;
  }, [sp, min, max]);

  const [value, setValue] = useState<string>(
    String(currentPageSize ?? defaultValue)
  );

  useEffect(() => {
    setValue(String(currentPageSize ?? defaultValue));
  }, [currentPageSize, defaultValue]);

  const apply = useCallback(
    (raw: string) => {
      const n = Number(raw);
      const nextValid =
        Number.isFinite(n) && n > 0
          ? Math.max(min, Math.min(max, Math.floor(n)))
          : null;

      const cur = sp.get("pageSize");
      const next = nextValid ? String(nextValid) : null;

      if ((cur ?? null) === next) return;

      const nextSp = new URLSearchParams(sp.toString());
      if (next) nextSp.set("pageSize", next);
      else nextSp.delete("pageSize");

      nextSp.set("page", "1");

      router.replace(`/?${nextSp.toString()}`, { scroll: false });
    },
    [router, sp, min, max]
  );

  const onBlur = () => apply(value);
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      (e.currentTarget as HTMLInputElement).blur();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-slate-500">Show</span>
      <Input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={String(defaultValue)}
        className="w-20"
        aria-label="Products per page"
        title={`Products per page (min ${min}, max ${max})`}
      />
      <Button
        type="button"
        onClick={() => apply(value)}
        variant="outline"
        size="sm"
      >
        Apply
      </Button>
      <span className="text-sm text-slate-500">/ page</span>
    </div>
  );
}
