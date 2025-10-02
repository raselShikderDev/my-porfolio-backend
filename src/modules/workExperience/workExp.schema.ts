import { z } from 'zod';


export const WorkExperienceCreateSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  descreption: z.string().min(1, "Description is required"),
  userId: z.number(), // since your Prisma model expects Int
  startDate: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return val;
  }, z.date()),
  endDate: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return val;
  }, z.date()),
});



export const WorkExperienceUpdateSchema = z.object({
  companyName: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  descreption: z.string().optional(),
  startDate: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return val;
  }, z.date()).optional(),
  endDate: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return val;
  }, z.date()).optional(),
});