import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email({ message: 'Email should be valid' }),
  password: z
    .string()
    .min(8, { message: 'Password should be at least 8 character' })
    .max(16, { message: 'Password must not exceed 16 character' }),
});
