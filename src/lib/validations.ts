import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name is too long"),
  imageUrl: z
    .string()
    .trim()
    .min(1, "Image URL or file is required")
    .refine(
      (v) =>
        /^https?:\/\//i.test(v) ||
        /^data:image\//i.test(v) ||
        v.startsWith("blob:"),
      "Must be a valid http(s) URL or a data:image/… or a blob: URL"
    ),
});

export type ProductInput = z.infer<typeof productSchema>;
