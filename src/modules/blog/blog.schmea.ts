import { z } from "zod";

export const blogCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  images: z.array(z.url("Each image must be a valid URL")).nonempty("At least one image is required"),
  published: z.boolean(),
  publishedDate: z.preprocess(
    (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : undefined),
    z.date({ message: "Published date is required" })
  ),
  slug: z.string().min(1, "Slug is required"),
  authorId: z.number(),
  tags: z.array(z.string()).optional().default([]),
});


export const blogUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().optional(),
  images: z.array(z.url("Each image must be a valid URL")).nonempty("At least one image is required").optional(),
  published: z.boolean().optional(),
  publishedDate: z.preprocess(
    (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : undefined),
    z.date({ message: "Published date is required" })
  ).optional(),
  slug: z.string().min(1, "Slug is required").optional(),
  authorId: z.number().optional(),
  tags: z.array(z.string()).optional(),
});



