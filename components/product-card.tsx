"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import type { ProductLite } from "@/types/product";
import { normalizeUrl, shouldProxy } from "@/libs/url";
import { placeholderSvg } from "@/libs/placeholder";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IMAGE_LOAD_TIMEOUT_MS } from "@/lib/constants";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = { product: ProductLite };

export default function ProductCard({ product }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const [deleting, setDeleting] = useState(false);

  const raw = useMemo(() => normalizeUrl(product.imageUrl), [product.imageUrl]);
  const proxied = useMemo(() => {
    if (shouldProxy(raw)) {
      return `/api/image?u=${encodeURIComponent(raw)}&label=Image`;
    }
    return raw;
  }, [raw]);

  const [src, setSrc] = useState<string>(proxied);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(proxied);
    setLoaded(false);
    setFailed(false);
    const img = new Image();
    img.src = proxied;
    if (img.complete) setLoaded(true);
  }, [proxied]);

  useEffect(() => {
    if (loaded || failed) return;
    const t = setTimeout(() => {
      if (!loaded) {
        setFailed(true);
        setSrc(placeholderSvg(product.name));
        setLoaded(true);
      }
    }, IMAGE_LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [loaded, failed, product.name]);

  const handleDelete = async () => {
    if (deleting) return;
    setConfirmOpen(true);
  };

  const handleEdit = () => {
    router.push(`/products?id=${product.id}`, { scroll: false });
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const confirmDelete = async () => {
    if (deleting) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/products?id=${product.id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) throw new Error("Delete failed");
      toast({ title: "Deleted", description: `${product.name} removed` });
      setConfirmOpen(false);
      router.refresh();
    } catch (e: any) {
      toast({
        title: "Could not delete",
        description: e?.message ?? "Try again",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-sm transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg gap-0"
      role="article"
      aria-label={product.name}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-slate-200" />
        )}

        <img
          src={src}
          alt={product.name}
          referrerPolicy="no-referrer"
          className={`h-full w-full object-cover transition-transform duration-500 ease-out ${
            loaded ? "opacity-100 group-hover:scale-[1.04]" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (!failed) {
              setFailed(true);
              setSrc(placeholderSvg(product.name));
              setLoaded(true);
            }
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute left-3 top-3">
          <Badge variant="secondary">
            {new Date(product.createdAt).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
            })}
          </Badge>
        </div>

        <div className="absolute right-3 top-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-md backdrop-blur-sm ring-1 ring-black/5 transition hover:bg-white"
              aria-label="Options"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16">
                <circle cx="8" cy="2" r="1.5" />
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="8" cy="14" r="1.5" />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={handleEdit}>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit product
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:bg-red-50"
                onClick={handleDelete}
                disabled={deleting}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                {deleting ? "Deleting…" : "Delete product"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="px-5 py-4">
        <h3
          className="text-lg md:text-xl font-semibold text-slate-900 wrap-break-word whitespace-normal leading-snug line-clamp-2 select-none cursor-default"
          title={product.name}
        >
          {product.name}
        </h3>
      </CardContent>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="rounded-2xl p-0 gap-0 max-w-md">
          <DialogTitle className="sr-only">Delete product</DialogTitle>
          <div className="bg-red-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-red-700/50 flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Delete product?</h3>
                <p className="text-red-100 text-sm leading-relaxed">
                  This action cannot be undone. The product will be permanently
                  removed from the catalog.
                </p>
              </div>
            </div>
          </div>

          {/* Product preview card */}
          <div className="p-6 bg-linear-to-br from-red-50 to-pink-50">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
              <div className="flex items-center gap-3">
                <img
                  src={src}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 truncate">
                    {product.name}
                  </h4>
                  <p className="text-sm text-slate-500">
                    Added:{" "}
                    {new Date(product.createdAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-6 pt-0">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
              className="flex-1 h-11 bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting…" : "Delete product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
