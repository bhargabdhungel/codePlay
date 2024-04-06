import z from 'zod';

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;