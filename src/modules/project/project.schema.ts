import { z } from 'zod';

export const ProjectCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'Project title is required')
    .min(3, 'Project title must be at least 3 characters long'),
  description: z
    .string()
    .min(1, 'Project description is required')
    .min(10, 'Project description must be at least 10 characters long'),
  image: z
    .url('Project image must be a valid URL')
    .min(1, 'Project image URL is required'),
  techStack: z
    .array(z.string().min(1, 'Tech stack item cannot be empty'))
    .min(1, 'At least one tech stack item is required'),
  liveUrl: z
    .url('Live URL must be a valid link')
    .min(1, 'Live project URL is required'),
  githubUrl: z
    .url('GitHub URL must be a valid link')
    .min(1, 'GitHub repository URL is required'),
  userId: z.number().positive('User ID must be a positive number'),
});

export const ProjectUpdateSchema = z.object({
  title: z
    .string()
    .min(3, 'Project title must be at least 3 characters long')
    .optional(),
  description: z
    .string()
    .min(10, 'Project description must be at least 10 characters long')
    .optional(),
  image: z.url('Project image must be a valid URL').optional(),
  techStack: z
    .array(z.string().min(1, 'Tech stack item cannot be empty'))
    .min(1, 'At least one tech stack item is required')
    .optional(),
  liveUrl: z.url('Live URL must be a valid link').optional(),
  githubUrl: z.url('GitHub URL must be a valid link').optional(),
});
