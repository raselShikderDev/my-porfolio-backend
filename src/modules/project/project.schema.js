"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectUpdateSchema = exports.ProjectCreateSchema = void 0;
const zod_1 = require("zod");
exports.ProjectCreateSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, 'Project title is required')
        .min(3, 'Project title must be at least 3 characters long'),
    description: zod_1.z
        .string()
        .min(1, 'Project description is required')
        .min(10, 'Project description must be at least 10 characters long'),
    image: zod_1.z
        .url('Project image must be a valid URL')
        .min(1, 'Project image URL is required'),
    techStack: zod_1.z
        .array(zod_1.z.string().min(1, 'Tech stack item cannot be empty'))
        .min(1, 'At least one tech stack item is required'),
    liveUrl: zod_1.z
        .url('Live URL must be a valid link')
        .min(1, 'Live project URL is required'),
    githubUrl: zod_1.z
        .url('GitHub URL must be a valid link')
        .min(1, 'GitHub repository URL is required'),
    userId: zod_1.z.number().positive('User ID must be a positive number'),
});
exports.ProjectUpdateSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3, 'Project title must be at least 3 characters long')
        .optional(),
    description: zod_1.z
        .string()
        .min(10, 'Project description must be at least 10 characters long')
        .optional(),
    image: zod_1.z.url('Project image must be a valid URL').optional(),
    techStack: zod_1.z
        .array(zod_1.z.string().min(1, 'Tech stack item cannot be empty'))
        .min(1, 'At least one tech stack item is required')
        .optional(),
    liveUrl: zod_1.z.url('Live URL must be a valid link').optional(),
    githubUrl: zod_1.z.url('GitHub URL must be a valid link').optional(),
});
