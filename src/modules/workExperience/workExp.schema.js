"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkExperienceUpdateSchema = exports.WorkExperienceCreateSchema = void 0;
const zod_1 = require("zod");
exports.WorkExperienceCreateSchema = zod_1.z.object({
    companyName: zod_1.z.string().min(1, "Company name is required"),
    role: zod_1.z.string().min(1, "Role is required"),
    descreption: zod_1.z.string().min(1, "Description is required"),
    userId: zod_1.z.number(), // since your Prisma model expects Int
    startDate: zod_1.z.preprocess((val) => {
        if (typeof val === "string" || val instanceof Date)
            return new Date(val);
        return val;
    }, zod_1.z.date()),
    endDate: zod_1.z.preprocess((val) => {
        if (typeof val === "string" || val instanceof Date)
            return new Date(val);
        return val;
    }, zod_1.z.date()),
});
exports.WorkExperienceUpdateSchema = zod_1.z.object({
    companyName: zod_1.z.string().min(1).optional(),
    role: zod_1.z.string().min(1).optional(),
    descreption: zod_1.z.string().optional(),
    startDate: zod_1.z.preprocess((val) => {
        if (typeof val === "string" || val instanceof Date)
            return new Date(val);
        return val;
    }, zod_1.z.date()).optional(),
    endDate: zod_1.z.preprocess((val) => {
        if (typeof val === "string" || val instanceof Date)
            return new Date(val);
        return val;
    }, zod_1.z.date()).optional(),
});
