import { z } from 'zod';

export const signupUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long')
    .regex(/^[a-zA-Z0-9]+$/, 'Username must contain only numbers and alphabets'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long'),
});

export type SignupUser = z.infer<typeof signupUserSchema>;
