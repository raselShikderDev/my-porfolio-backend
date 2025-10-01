import { z } from 'zod';

export const ProjectCreateSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  techStack: z.array(z.string()),
  liveUrl: z.url(),
  githubUrl: z.url(),
  userId: z.string(),
});


