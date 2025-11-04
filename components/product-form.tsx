"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { normalizeUrl, shouldProxy } from "@/libs/url";
import { placeholderSvg } from "@/libs/placeholder";
import { productSchema, type ProductInput } from "@/libs/validations";
import type { ProductLite } from "@/types/product";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProductFormProps = {
  product?: ProductLite;
  mode?: "create" | "edit";
  onSuccess?: () => void;
};

export default function ProductForm({
  product,
  mode = "create",
  onSuccess,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      imageUrl: product?.imageUrl ?? "",
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
    reset,
  } = form;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");
  const imageValue = watch("imageUrl");

  const previewSrc = useMemo(() => {
    const raw = normalizeUrl(imageValue || "");
    if (!raw) return "";
    return shouldProxy(raw)
      ? `/api/image?u=${encodeURIComponent(raw)}&label=Image`
      : raw;
  }, [imageValue]);

  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [previewSrc]);

  const effectiveSrc = previewSrc || placeholderSvg(product?.name || "Image");

  const onSubmit = async (values: ProductInput) => {
    setLoading(true);
    try {
      const isEdit = mode === "edit" && product?.id;
      const url = isEdit ? `/api/products?id=${product!.id}` : "/api/products";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const err =
          body?.error?.fieldErrors?.imageUrl?.[0] ||
          body?.error?.fieldErrors?.name?.[0] ||
          body?.error?.message ||
          `Could not ${isEdit ? "update" : "create"} product`;
        throw new Error(err);
      }

      if (!isEdit) {
        reset({ name: "", imageUrl: "" });
        setFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }

      toast({
        title: isEdit ? "Product updated" : "Product created",
        description: isEdit ? "Changes saved successfully." : "Your product is now in the list.",
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (e: any) {
      toast({
        title: "Could not save",
        description: e?.message ?? "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-8 md:grid-cols-2 md:items-start"
    >
      <div className="space-y-5 md:self-start">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {mode === "edit" ? "Edit product" : "Add product"}
          </h2>
          <p className="text-[15px] text-slate-600">
            Name and image (URL or file).
          </p>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="e.g. Keyboard"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL (or upload below)</Label>
          <Input
            id="imageUrl"
            placeholder="https://loremflickr.com/1200/600/keyboard?lock=101"
            {...register("imageUrl")}
          />
          {errors.imageUrl && (
            <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const dataUrl = String(reader.result || "");
                setValue("imageUrl", dataUrl, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                trigger("imageUrl");
                setFileName(file.name);
              };
              reader.readAsDataURL(file);
            }}
          />

          <div className="mt-2 flex items-center gap-2">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!!imageValue || !!fileName}
            >
              Upload image
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setValue("imageUrl", "", {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                trigger("imageUrl");
                setFileName("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              disabled={!imageValue && !fileName}
            >
              Clear image
            </Button>
          </div>

          {fileName && (
            <p
              className="mt-1 break-all text-xs text-slate-600"
              aria-live="polite"
            >
              File: {fileName}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || !isValid}
          className="mt-1 w-full py-3"
          size="lg"
        >
          {loading ? "Saving…" : "Save"}
        </Button>
      </div>

      <div className="order-first md:order-0 md:self-start">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-sky-50 via-cyan-50 to-indigo-50 shadow-inner">
          <div className="relative h-56 w-full md:h-64 lg:h-72 xl:h-80">
            {effectiveSrc ? (
              <Image
                priority
                key={effectiveSrc}
                src={
                  broken
                    ? placeholderSvg(product?.name || "Image")
                    : effectiveSrc
                }
                alt="Preview"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover object-center"
                unoptimized
                referrerPolicy="no-referrer"
                onError={() => setBroken(true)}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3">
                <svg
                  width="88"
                  height="88"
                  viewBox="0 0 24 24"
                  className="text-sky-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="M21 15l-4.5-4.5L7 21" />
                </svg>
                <span className="text-sm font-medium text-slate-600">
                  Image
                </span>
              </div>
            )}
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-slate-500">
          The image preview updates automatically.
        </p>
      </div>
    </form>
  );
}
