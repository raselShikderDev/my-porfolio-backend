"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogUpdateSchema = exports.blogCreateSchema = void 0;
const zod_1 = require("zod");
exports.blogCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    content: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.url("Each image must be a valid URL")).nonempty("At least one image is required"),
    published: zod_1.z.boolean(),
    publishedDate: zod_1.z.preprocess((val) => (typeof val === "string" || val instanceof Date ? new Date(val) : undefined), zod_1.z.date({ message: "Published date is required" })),
    slug: zod_1.z.string().min(1, "Slug is required"),
    authorId: zod_1.z.number(),
    tags: zod_1.z.array(zod_1.z.string()).optional().default([]),
});
exports.blogUpdateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").optional(),
    content: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.url("Each image must be a valid URL")).nonempty("At least one image is required").optional(),
    published: zod_1.z.boolean().optional(),
    publishedDate: zod_1.z.preprocess((val) => (typeof val === "string" || val instanceof Date ? new Date(val) : undefined), zod_1.z.date({ message: "Published date is required" })).optional(),
    slug: zod_1.z.string().min(1, "Slug is required").optional(),
    authorId: zod_1.z.number().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
