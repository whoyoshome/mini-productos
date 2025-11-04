"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductForm from "@/components/product-form";
import type { ProductLite } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type ProductModalProps = {
  isIntercepted?: boolean;
};

export default function ProductModal({
  isIntercepted = false,
}: ProductModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [product, setProduct] = useState<ProductLite | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!isIntercepted) return;

    const { body, documentElement } = document;
    const y = window.scrollY;
    const scrollbarComp = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    if (scrollbarComp > 0) body.style.paddingRight = `${scrollbarComp}px`;

    return () => {
      const prevY = -parseInt(body.style.top || "0", 10) || 0;

      body.style.overflow = "";
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.paddingRight = "";

      window.scrollTo(0, prevY);
    };
  }, [isIntercepted]);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load product:", err);
        router.push("/");
      }
    };

    fetchProduct();
  }, [id, router]);

  const handleClose = () => {
    router.back();
  };

  const handleSuccess = () => {
    router.back();
    setTimeout(() => router.refresh(), 100);
  };

  const mode = id ? "edit" : "create";
  const shouldShowForm = mode === "create" || (mode === "edit" && product);

  const LoadingSkeleton = () => (
    <div className="space-y-6 py-12">
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );

  if (isIntercepted) {
    return (
      <div
        className="fixed inset-0 z-50 flex justify-center overflow-y-auto p-4 md:p-8"
        data-modal="true"
      >
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md animate-backdrop-in"
          onClick={handleClose}
          aria-hidden
        />

        <div className="relative z-50 my-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/95 px-6 py-5 shadow-2xl ring-1 ring-black/5 backdrop-blur-sm md:px-8 md:py-6 animate-modal-in">
          <Button
            onClick={handleClose}
            variant="ghost"
            size="icon"
            className="absolute -right-3 -top-3 z-10 rounded-full bg-white shadow-lg ring-1 ring-slate-200 hover:bg-slate-50"
            aria-label="Close"
            title="Close"
          >
            ×
          </Button>

          <div className="mb-6 flex items-center justify-between">
            <Button
              onClick={handleClose}
              variant="link"
              className="text-sm text-blue-600 hover:underline p-0 h-auto"
            >
              ← Back to list
            </Button>
          </div>

          {loading || !shouldShowForm ? (
            <LoadingSkeleton />
          ) : (
            <ProductForm
              product={product ?? undefined}
              mode={mode}
              onSuccess={handleSuccess}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-start justify-center p-4 md:p-8"
      data-modal="true"
    >
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />

      <div className="relative z-101 my-4 w-full max-w-4xl rounded-3xl border border-slate-200/70 bg-white shadow-2xl">
        <Button
          onClick={handleClose}
          variant="ghost"
          size="icon"
          aria-label="Close"
          title="Close"
          className="absolute right-3 top-3 rounded-full bg-slate-900/80 text-white shadow ring-2 ring-white/70 hover:bg-slate-900"
        >
          ×
        </Button>

        <div className="grid gap-6 p-5 md:p-8">
          <Button
            onClick={handleClose}
            variant="link"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 p-0 h-auto"
          >
            <span className="-ml-1">←</span> Back to list
          </Button>

          {loading || !shouldShowForm ? (
            <div className="space-y-6 min-h-[360px]">
              <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex justify-end gap-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ) : (
            <ProductForm
              product={product ?? undefined}
              mode={mode}
              onSuccess={handleSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}
