import { z } from "zod";

export const resumeCreateSchema = z.object({
  userId: z.number(),
  resumeUrl: z.string().url("Resume URL must be a valid URL"),
  fileName: z.string().optional(),
});

export const resumeUpdateSchema = z.object({
  resumeUrl: z.string().url("Resume URL must be a valid URL").optional(),
  fileName: z.string().optional(),
});